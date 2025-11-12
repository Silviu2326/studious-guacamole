# Operaciones del Centro — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/turnos-horarios-del-staff` — Turnos & Horarios del Staff
- **Componente raíz**: `src/features/turnos-horarios-del-staff/pages/turnos-horarios-del-staffPage.tsx`
- **Componentes hijos**:
  - `TurnosStaff` (`src/features/turnos-horarios-del-staff/components/TurnosStaff.tsx`) - Gestión de turnos
  - `CuadrantesPersonal` (`src/features/turnos-horarios-del-staff/components/CuadrantesPersonal.tsx`) - Cuadrantes del personal
  - `GestorVacaciones` (`src/features/turnos-horarios-del-staff/components/GestorVacaciones.tsx`) - Gestión de vacaciones
  - `AsignacionTurnos` (`src/features/turnos-horarios-del-staff/components/AsignacionTurnos.tsx`) - Asignación de turnos
  - `ControlHorarios` (`src/features/turnos-horarios-del-staff/components/ControlHorarios.tsx`) - Control de horarios
- **API**: `src/features/turnos-horarios-del-staff/api/` (turnos, personal, controlHorarios, cuadrantes, vacaciones)
- **Estados**:
  - Loading: Estados de carga en cada componente
  - Error: Manejo de errores en componentes
  - Vacío: No hay estado vacío explícito
- **Guardias**: Verificación explícita de rol (`user?.role === 'entrenador'` muestra mensaje de acceso restringido)
- **Tabs**: 5 tabs (turnos, cuadrantes, vacaciones, asignación, control horarios)
- **Métricas**: Personal Activo, Turnos Hoy, Vacaciones Pendientes, Incidencias Hoy

#### `/control-de-acceso-aforo` — Control de Acceso & Aforo en Tiempo Real
- **Componente raíz**: `src/features/control-de-acceso-aforo-en-tiempo-real/pages/control-de-acceso-aforo-en-tiempo-realPage.tsx`
- **Componentes hijos**:
  - `AforoTiempoReal` (`src/features/control-de-acceso-aforo-en-tiempo-real/components/AforoTiempoReal.tsx`) - Aforo en tiempo real
  - `ControlAcceso` (`src/features/control-de-acceso-aforo-en-tiempo-real/components/ControlAcceso.tsx`) - Control de acceso
  - `Torniquetes` (`src/features/control-de-acceso-aforo-en-tiempo-real/components/Torniquetes.tsx`) - Gestión de torniquetes
  - `ContadorPersonas` (`src/features/control-de-acceso-aforo-en-tiempo-real/components/ContadorPersonas.tsx`) - Contador de personas
  - `AlertasAforo` (`src/features/control-de-acceso-aforo-en-tiempo-real/components/AlertasAforo.tsx`) - Alertas de aforo
- **Estados**:
  - Loading: Estados de carga en cada componente
  - Error: Manejo de errores en componentes
  - Vacío: No hay estado vacío explícito
- **Guardias**: No hay guardias explícitas (depende de Layout, sección `gimnasioOnly: true`)
- **Tabs**: 5 tabs (aforo, acceso, torniquetes, contador, alertas)

#### `/mantenimiento-incidencias` — Mantenimiento & Incidencias
- **Componente raíz**: `src/features/mantenimiento-incidencias/pages/mantenimiento-incidenciasPage.tsx`
- **Componentes hijos**:
  - `MantenimientoManager` (`src/features/mantenimiento-incidencias/components/MantenimientoManager.tsx`) - Gestor principal
  - `GestorIncidencias` (`src/features/mantenimiento-incidencias/components/GestorIncidencias.tsx`) - Gestión de incidencias
  - `ChecklistMantenimiento` (`src/features/mantenimiento-incidencias/components/ChecklistMantenimiento.tsx`) - Checklists de mantenimiento
  - `SeguimientoReparaciones` (`src/features/mantenimiento-incidencias/components/SeguimientoReparaciones.tsx`) - Seguimiento de reparaciones
  - `AlertasMantenimiento` (`src/features/mantenimiento-incidencias/components/AlertasMantenimiento.tsx`) - Alertas de mantenimiento
- **API**: `src/features/mantenimiento-incidencias/services/mantenimientoService.ts`
- **Estados**:
  - Loading: `loading` state en MantenimientoManager
  - Error: Manejo de errores en componentes
  - Vacío: No hay estado vacío explícito
- **Guardias**: No hay guardias explícitas (depende de Layout, sección `gimnasioOnly: true`)
- **Tabs**: 5 tabs (dashboard, incidencias, checklist, reparaciones, alertas)
- **Métricas**: Equipamiento Total, Incidencias Pendientes, Mantenimientos Programados, Reparaciones en Curso, Alertas Pendientes, Costo Total Mes

#### `/operations/checklists` — Checklists Operativos (Apertura/Cierre/Limpieza)
- **Componente raíz**: `src/features/checklists-operativos-aperturacierrelimpieza/pages/checklists-operativos-aperturacierrelimpiezaPage.tsx`
- **Componentes hijos**:
  - `ChecklistDashboard` (`src/features/checklists-operativos-aperturacierrelimpieza/components/ChecklistDashboard.tsx`) - Dashboard principal
  - `ChecklistTemplateBuilder` (`src/features/checklists-operativos-aperturacierrelimpieza/components/ChecklistTemplateBuilder.tsx`) - Constructor de plantillas
  - `ChecklistInstanceView` (`src/features/checklists-operativos-aperturacierrelimpieza/components/ChecklistInstanceView.tsx`) - Vista de instancia
  - `ChecklistItem` (`src/features/checklists-operativos-aperturacierrelimpieza/components/ChecklistItem.tsx`) - Tarea individual
- **API**: `src/features/checklists-operativos-aperturacierrelimpieza/services/checklistsService.ts`, `api/checklistsApi.ts`
- **Estados**:
  - Loading: `loading` state en ChecklistDashboard
  - Error: Manejo de errores en componentes
  - Vacío: No hay estado vacío explícito
- **Guardias**: No hay guardias explícitas (depende de Layout, sección `gimnasioOnly: true`)
- **Tabs**: 2 tabs (instances, templates)
- **Tipos**: Instancias de checklist y plantillas de checklist

#### `/recursos-salas-material` — Salas & Recursos
- **Componente raíz**: `src/features/recursos-salas-material/pages/recursos-salas-materialPage.tsx`
- **Componentes hijos**:
  - `GestorRecursos` (`src/features/recursos-salas-material/components/GestorRecursos.tsx`) - Gestor principal
  - `SalasDisponibles` (`src/features/recursos-salas-material/components/SalasDisponibles.tsx`) - Salas disponibles
  - `ControlAforo` (`src/features/recursos-salas-material/components/ControlAforo.tsx`) - Control de aforo
  - `BloqueosMantenimiento` (`src/features/recursos-salas-material/components/BloqueosMantenimiento.tsx`) - Bloqueos por mantenimiento
  - `MaterialDisponible` (`src/features/recursos-salas-material/components/MaterialDisponible.tsx`) - Material disponible
  - `ReservasSalas` (`src/features/recursos-salas-material/components/ReservasSalas.tsx`) - Reservas de salas
  - `MantenimientoPreventivo` (`src/features/recursos-salas-material/components/MantenimientoPreventivo.tsx`) - Mantenimiento preventivo
  - `AnalyticsRecursos` (`src/features/recursos-salas-material/components/AnalyticsRecursos.tsx`) - Analytics de recursos
- **API**: `src/features/recursos-salas-material/api/` (salasApi, materialApi)
- **Estados**:
  - Loading: `loading` state en GestorRecursos
  - Error: Manejo de errores en componentes
  - Vacío: No hay estado vacío explícito
- **Guardias**: No hay guardias explícitas (depende de Layout, sección `gimnasioOnly: true`)
- **Tabs**: 8 tabs (overview, salas, material, aforo, reservas, bloqueos, mantenimiento, analytics)
- **Métricas**: Salas Totales, Ocupación Promedio, Material Disponible, En Mantenimiento

#### `/operations/documents` — Documentación Interna y Protocolos
- **Componente raíz**: `src/features/documentacion-interna-y-protocolos/pages/documentacion-interna-y-protocolosPage.tsx`
- **Componentes hijos**:
  - `DocumentLibraryContainer` (`src/features/documentacion-interna-y-protocolos/components/DocumentLibraryContainer.tsx`) - Container principal
- **Estados**:
  - Loading: Estados de carga en componentes
  - Error: Manejo de errores en componentes
  - Vacío: No hay estado vacío explícito
- **Guardias**: Verificación explícita de rol (`isGymUser` muestra mensaje de acceso restringido si no es gimnasio)
- **Funcionalidades**: Biblioteca centralizada, control de versiones, sistema de acuse de recibo, categorización, búsqueda y filtrado

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Gestión Completa de Turnos del Personal con Múltiples Tipos**
**Página(s)**: `/turnos-horarios-del-staff` (Turnos & Horarios del Staff)

**Problema cubierto**: No hay forma de gestionar los turnos del personal de forma organizada con diferentes tipos de turnos y estados.

**Como lo resuelve el código**:
- `TurnosStaff` permite crear, editar y eliminar turnos
- Tipos de turnos: mañana, tarde, noche, completo
- Estados: asignado, confirmado, completado, cancelado, en_progreso
- Asignación de turnos a personal específico
- Gestión de horarios (hora inicio, hora fin)
- Notas y observaciones por turno
- Tabla con información completa: fecha, personal, tipo, horario, estado
- Búsqueda y filtrado de turnos

**Riesgos/limitaciones**:
- Turnos son mock (no hay persistencia real)
- No hay validación de solapamiento de turnos
- Falta integración con sistema de fichajes

### 2. **Gestión de Cuadrantes del Personal con Vista Mensual**
**Página(s)**: `/turnos-horarios-del-staff` (Turnos & Horarios del Staff)

**Problema cubierto**: No hay forma de visualizar los turnos del personal en formato de calendario/cuadrante mensual.

**Como lo resuelve el código**:
- `CuadrantesPersonal` muestra cuadrantes mensuales
- Vista de calendario con turnos asignados
- Visualización de turnos por personal
- Filtrado por personal y mes
- Información de turnos en cada día del mes
- Colores diferenciados por tipo de turno

**Riesgos/limitaciones**:
- Cuadrantes son mock (no hay persistencia real)
- No hay exportación a PDF o Excel
- Falta vista semanal

### 3. **Gestión de Vacaciones con Solicitudes y Aprobaciones**
**Página(s)**: `/turnos-horarios-del-staff` (Turnos & Horarios del Staff)

**Problema cubierto**: No hay forma de gestionar las solicitudes de vacaciones del personal con aprobaciones.

**Como lo resuelve el código**:
- `GestorVacaciones` permite gestionar vacaciones
- Solicitudes de vacaciones con fechas
- Estados: pendiente, aprobada, rechazada
- Aprobación/rechazo de solicitudes
- Vista de vacaciones programadas
- Filtrado por estado y personal

**Riesgos/limitaciones**:
- Vacaciones son mock (no hay persistencia real)
- No hay validación de días disponibles
- Falta notificación automática de aprobación/rechazo

### 4. **Control de Horarios con Registro de Entradas y Salidas**
**Página(s)**: `/turnos-horarios-del-staff` (Turnos & Horarios del Staff)

**Problema cubierto**: No hay forma de registrar y controlar las entradas y salidas del personal.

**Como lo resuelve el código**:
- `ControlHorarios` permite registrar entradas y salidas
- Registro manual de entrada/salida
- Registro de incidencias (retrasos, ausencias)
- Vista de control horario diario
- Estados: presente, ausente, retraso, salida anticipada
- Historial de registros

**Riesgos/limitaciones**:
- Control horario es mock (no hay persistencia real)
- No hay integración con lectores de tarjeta
- Falta validación automática de horarios vs turnos asignados

### 5. **Control de Aforo en Tiempo Real con Alertas**
**Página(s)**: `/control-de-acceso-aforo` (Control de Acceso & Aforo)

**Problema cubierto**: No hay forma de controlar el aforo del gimnasio en tiempo real con alertas cuando se alcanzan límites.

**Como lo resuelve el código**:
- `AforoTiempoReal` muestra aforo actual por zona
- Conteo de personas en tiempo real
- Límites de aforo configurables por zona
- Alertas cuando se alcanza el límite
- Visualización de ocupación (actual/máximo)
- Historial de aforo

**Riesgos/limitaciones**:
- Aforo es mock (no hay integración con sensores reales)
- No hay sincronización automática con sistema de acceso
- Falta notificación automática a gerencia cuando se alcanza límite

### 6. **Gestión de Torniquetes y Control de Acceso**
**Página(s)**: `/control-de-acceso-aforo` (Control de Acceso & Aforo)

**Problema cubierto**: No hay forma de gestionar torniquetes físicos y controlar el acceso al gimnasio.

**Como lo resuelve el código**:
- `Torniquetes` permite gestionar torniquetes
- Configuración de torniquetes físicos
- Estados: activo, inactivo, mantenimiento
- Control de acceso por tarjeta/credenciales
- Historial de accesos
- Bloqueo/desbloqueo de torniquetes

**Riesgos/limitaciones**:
- Torniquetes son mock (no hay integración con hardware real)
- No hay sincronización con sistema de membresías
- Falta detección de intentos de acceso no autorizados

### 7. **Gestión Completa de Mantenimiento e Incidencias**
**Página(s)**: `/mantenimiento-incidencias` (Mantenimiento & Incidencias)

**Problema cubierto**: No hay forma de gestionar el mantenimiento de equipamiento y reportar incidencias de forma centralizada.

**Como lo resuelve el código**:
- `MantenimientoManager` coordina todas las funcionalidades
- `GestorIncidencias` permite crear y gestionar incidencias
- Tipos de incidencias: crítica, alta, media, baja
- Estados: abierta, en progreso, resuelta, cerrada
- Asignación de incidencias a personal
- Seguimiento de reparaciones con costos
- Checklists de mantenimiento preventivo
- Alertas automáticas de mantenimientos pendientes
- Dashboard con métricas: equipamiento total, incidencias pendientes, costos

**Riesgos/limitaciones**:
- Mantenimiento es mock (no hay persistencia real)
- No hay notificación automática cuando se crea incidencia crítica
- Falta integración con proveedores externos de reparación

### 8. **Checklists Operativos con Plantillas Reutilizables**
**Página(s)**: `/operations/checklists` (Checklists Operativos)

**Problema cubierto**: No hay forma de estandarizar procesos operativos (apertura, cierre, limpieza) con checklists digitales.

**Como lo resuelve el código**:
- `ChecklistTemplateBuilder` permite crear plantillas de checklist
- `ChecklistDashboard` muestra instancias y plantillas
- Plantillas con tareas críticas y no críticas
- Asignación de checklists al personal
- Ejecución desde cualquier dispositivo
- Seguimiento de progreso en tiempo real
- Estados: pendiente, en progreso, completado, retrasado
- Reporte de incidencias con fotos y notas
- Historial completo de operaciones

**Riesgos/limitaciones**:
- Checklists son mock (no hay persistencia real)
- No hay notificación automática cuando checklist está retrasado
- Falta validación de que todas las tareas críticas están completadas

### 9. **Gestión de Salas y Recursos con Control de Disponibilidad**
**Página(s)**: `/recursos-salas-material` (Salas & Recursos)

**Problema cubierto**: No hay forma de gestionar salas, material y recursos físicos con control de disponibilidad y reservas.

**Como lo resuelve el código**:
- `GestorRecursos` coordina todas las funcionalidades
- `SalasDisponibles` muestra salas con estados (disponible, ocupada, mantenimiento, bloqueada)
- Control de aforo por sala
- `MaterialDisponible` gestiona inventario de material
- `ReservasSalas` permite reservar salas
- `BloqueosMantenimiento` gestiona bloqueos por mantenimiento
- `MantenimientoPreventivo` programa mantenimientos preventivos
- `AnalyticsRecursos` muestra métricas de utilización
- Dashboard con métricas: salas totales, ocupación promedio, material disponible

**Riesgos/limitaciones**:
- Recursos son mock (no hay persistencia real)
- No hay sincronización con sistema de reservas
- Falta alertas cuando material está bajo stock

### 10. **Biblioteca de Documentación Interna con Control de Versiones**
**Página(s)**: `/operations/documents` (Documentación Interna y Protocolos)

**Problema cubierto**: No hay forma de centralizar documentación operativa (protocolos, manuales) con control de versiones.

**Como lo resuelve el código**:
- `DocumentLibraryContainer` gestiona biblioteca de documentos
- Sistema de categorización de documentos
- Control de versiones
- Sistema de acuse de recibo
- Búsqueda y filtrado avanzado
- Dashboard de cumplimiento
- Acceso controlado por rol

**Riesgos/limitaciones**:
- Documentación es mock (no hay persistencia real)
- No hay notificación automática cuando se actualiza documento
- Falta validación de que personal ha leído documentos críticos

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Integración Real con Hardware de Control de Acceso**
**Necesidad detectada**: No hay integración real con torniquetes, lectores de tarjeta o sistemas de control de acceso físicos.

**Propuesta de solución** (alto nivel + impacto):
- Integración con APIs de fabricantes de torniquetes (ej: Kisi, Paxton)
- Sincronización en tiempo real de accesos
- Detección automática de accesos no autorizados
- Registro automático de entradas/salidas
- Integración con sistemas de membresías para validar acceso
- **Impacto**: Alto - Sin esto, el control de acceso no tiene valor funcional real.

**Páginas/flujo afectados**:
- `Torniquetes` (integración real)
- `ControlAcceso` (validación real)
- `AforoTiempoReal` (conteo automático)
- Nuevo servicio `AccessControlIntegrationService`

**Complejidad estimada**: Alta (requiere integración con hardware, APIs externas, tiempo real)

### 2. **Notificaciones Automáticas de Incidencias y Alertas**
**Necesidad detectada**: No hay notificaciones automáticas cuando se crean incidencias críticas o se alcanzan límites de aforo.

**Propuesta de solución** (alto nivel + impacto):
- Sistema de notificaciones push/email/SMS
- Alertas automáticas cuando se crea incidencia crítica
- Notificaciones cuando aforo alcanza límite
- Alertas cuando checklist está retrasado
- Notificaciones cuando material está bajo stock
- **Impacto**: Alto - Permite respuesta rápida a problemas críticos.

**Páginas/flujo afectados**:
- `GestorIncidencias` (notificaciones de incidencias)
- `AlertasAforo` (notificaciones de aforo)
- `ChecklistDashboard` (notificaciones de checklists retrasados)
- `MaterialDisponible` (alertas de stock bajo)
- Nuevo servicio `NotificationService`

**Complejidad estimada**: Media (requiere sistema de notificaciones, configuración de canales)

### 3. **Integración con Sistema de Fichajes/Control Horario Legal**
**Necesidad detectada**: El control de horarios es mock. No hay integración con sistemas de fichajes para cumplimiento legal.

**Propuesta de solución** (alto nivel + impacto):
- Integración con sistemas de fichaje (ej: relojes biométricos, apps móviles)
- Registro automático de entradas/salidas
- Cálculo automático de horas trabajadas
- Validación de cumplimiento de horarios legales
- Exportación de datos para nóminas
- **Impacto**: Alto - Necesario para cumplimiento legal de control horario.

**Páginas/flujo afectados**:
- `ControlHorarios` (integración real)
- Integración con módulo de RRHH/nóminas
- Nuevo servicio `TimeTrackingIntegrationService`

**Complejidad estimada**: Alta (requiere integración con hardware/software de fichajes, cumplimiento legal)

### 4. **Sincronización Automática de Aforo con Reservas**
**Necesidad detectada**: El aforo no se sincroniza automáticamente con las reservas de clases o servicios.

**Propuesta de solución** (alto nivel + impacto):
- Sincronización automática entre aforo y sistema de reservas
- Bloqueo automático de reservas cuando se alcanza aforo
- Actualización automática de aforo cuando se cancela reserva
- Previsión de aforo basada en reservas futuras
- **Impacto**: Alto - Evita sobreocupación y mejora experiencia del usuario.

**Páginas/flujo afectados**:
- `AforoTiempoReal` (sincronización con reservas)
- Integración con módulo de reservas/agenda
- Nuevo servicio `CapacitySyncService`

**Complejidad estimada**: Media (requiere integración cross-module, sincronización)

### 5. **Validación de Solapamiento de Turnos**
**Necesidad detectada**: No hay validación automática de que los turnos asignados no se solapen.

**Propuesta de solución** (alto nivel + impacto):
- Validación automática al crear/editar turno
- Detección de solapamientos entre turnos del mismo personal
- Alertas cuando se intenta asignar turno solapado
- Sugerencias de turnos alternativos
- **Impacto**: Medio/Alto - Evita conflictos de horarios y mejora planificación.

**Páginas/flujo afectados**:
- `TurnosStaff` (validación de solapamiento)
- `AsignacionTurnos` (validación al asignar)
- Nuevo servicio `ShiftValidationService`

**Complejidad estimada**: Media (requiere lógica de validación, comparación de horarios)

### 6. **Sistema de Aprobación de Vacaciones con Notificaciones**
**Necesidad detectada**: No hay notificaciones automáticas cuando se aprueba/rechaza vacación o cuando hay conflicto con turnos.

**Propuesta de solución** (alto nivel + impacto):
- Notificaciones automáticas de aprobación/rechazo
- Validación de días disponibles antes de aprobar
- Detección de conflictos con turnos asignados
- Recordatorios de vacaciones próximas
- **Impacto**: Medio/Alto - Mejora comunicación y evita conflictos.

**Páginas/flujo afectados**:
- `GestorVacaciones` (notificaciones y validaciones)
- Integración con sistema de notificaciones
- Nuevo servicio `VacationApprovalService`

**Complejidad estimada**: Media (requiere validación, notificaciones)

### 7. **Integración con Proveedores Externos de Mantenimiento**
**Necesidad detectada**: No hay integración con proveedores externos para solicitar reparaciones automáticamente.

**Propuesta de solución** (alto nivel + impacto):
- Integración con proveedores externos de mantenimiento
- Solicitud automática de reparaciones desde incidencias
- Seguimiento de estado de reparaciones externas
- Cálculo automático de costos
- Historial de proveedores y valoraciones
- **Impacto**: Medio/Alto - Agiliza proceso de reparaciones y reduce tiempo de inactividad.

**Páginas/flujo afectados**:
- `GestorIncidencias` (integración con proveedores)
- `SeguimientoReparaciones` (seguimiento externo)
- Integración con módulo de proveedores
- Nuevo servicio `MaintenanceProviderIntegrationService`

**Complejidad estimada**: Alta (requiere integración con proveedores externos, APIs)

### 8. **Analytics Avanzados de Utilización de Recursos**
**Necesidad detectada**: No hay análisis avanzado de utilización de salas, material y recursos para optimizar operaciones.

**Propuesta de solución** (alto nivel + impacto):
- Dashboard de analytics con tendencias
- Análisis de utilización por hora/día/semana
- Identificación de recursos infrautilizados
- Predicción de demanda de recursos
- Recomendaciones de optimización
- **Impacto**: Medio/Alto - Permite optimizar uso de recursos y reducir costos.

**Páginas/flujo afectados**:
- `AnalyticsRecursos` (analytics avanzados)
- Nuevo servicio `ResourceAnalyticsService`
- Dashboard mejorado con gráficos y tendencias

**Complejidad estimada**: Media (requiere análisis de datos, visualizaciones)

### 9. **Sistema de Validación de Checklists con Firma Digital**
**Necesidad detectada**: No hay validación de que las tareas críticas están completadas correctamente ni firma digital de finalización.

**Propuesta de solución** (alto nivel + impacto):
- Validación obligatoria de tareas críticas antes de completar checklist
- Firma digital de finalización de checklist
- Requerimiento de fotos para tareas críticas
- Bloqueo de finalización si faltan tareas críticas
- Auditoría completa con timestamps y firmas
- **Impacto**: Medio/Alto - Asegura cumplimiento de procesos críticos y trazabilidad.

**Páginas/flujo afectados**:
- `ChecklistInstanceView` (validación y firma)
- `ChecklistItem` (validación de tareas críticas)
- Nuevo servicio `ChecklistValidationService`

**Complejidad estimada**: Media (requiere validación, firma digital)

### 10. **Sistema de Acuse de Recibo Obligatorio para Documentos Críticos**
**Necesidad detectada**: No hay validación de que el personal ha leído documentos críticos (protocolos de seguridad, normativas).

**Propuesta de solución** (alto nivel + impacto):
- Sistema de acuse de recibo obligatorio para documentos críticos
- Notificación cuando se requiere lectura
- Bloqueo de acceso a funcionalidades hasta acusar recibo
- Historial de acuses de recibo con timestamps
- Dashboard de cumplimiento por personal
- **Impacto**: Medio/Alto - Asegura que personal conoce protocolos críticos.

**Páginas/flujo afectados**:
- `DocumentLibraryContainer` (acuse de recibo obligatorio)
- Sistema de permisos (bloqueo hasta acusar recibo)
- Nuevo servicio `DocumentAcknowledgmentService`

**Complejidad estimada**: Media (requiere validación, sistema de permisos)

---

## 4) Hallazgos desde navegación/menús

### Sidebar.tsx

**Estructura de la sección**:
```typescript
{
  id: 'operaciones',
  title: 'Operaciones del Centro',
  icon: Wrench,
  gimnasioOnly: true,
  items: [
    { id: 'turnos-horarios-del-staff', label: 'Turnos & Horarios', icon: Calendar, path: '/turnos-horarios-del-staff' },
    { id: 'control-de-acceso-aforo', label: 'Control de Acceso & Aforo', icon: Shield, path: '/control-de-acceso-aforo' },
    { id: 'mantenimiento-incidencias', label: 'Mantenimiento & Incidencias', icon: Wrench, path: '/mantenimiento-incidencias' },
    { id: 'operations-checklists', label: 'Checklists Operativos', icon: Clipboard, path: '/operations/checklists' },
    { id: 'recursos-salas-material', label: 'Salas & Recursos', icon: Boxes, path: '/recursos-salas-material' },
    { id: 'documentacion-interna-y-protocolos', label: 'Documentación Interna', icon: FileText, path: '/operations/documents' },
  ],
}
```

**Permisos y visibilidad**:
- Toda la sección es solo para gimnasios (`gimnasioOnly: true`)
- Algunas páginas tienen guardias adicionales (ej: Documentación Interna verifica roles específicos)
- No hay badges o contadores de notificaciones

**Inconsistencias de UX o naming**:
1. **Naming inconsistente**:
   - "Turnos & Horarios" (español)
   - "Control de Acceso & Aforo" (español)
   - "Mantenimiento & Incidencias" (español)
   - "Checklists Operativos" (español)
   - "Salas & Recursos" (español)
   - "Documentación Interna" (español, pero incompleto - debería ser "Documentación Interna y Protocolos")

2. **Rutas inconsistentes**:
   - `/turnos-horarios-del-staff` (español, con guiones)
   - `/control-de-acceso-aforo` (español, con guiones)
   - `/mantenimiento-incidencias` (español, con guiones)
   - `/operations/checklists` (inglés, bajo operations)
   - `/recursos-salas-material` (español, con guiones)
   - `/operations/documents` (inglés, bajo operations)
   - Mezcla de español/inglés y rutas diferentes

3. **Iconos inconsistentes**:
   - Calendar para "Turnos & Horarios" (específico)
   - Shield para "Control de Acceso & Aforo" (específico)
   - Wrench para sección y "Mantenimiento & Incidencias" (duplicado)
   - Clipboard para "Checklists Operativos" (específico)
   - Boxes para "Salas & Recursos" (específico)
   - FileText para "Documentación Interna" (específico)
   - Falta coherencia en estilo de iconos

4. **Falta de conexión con otras secciones**:
   - "Turnos & Horarios" podría estar relacionada con "Equipo / RRHH"
   - "Control de Acceso & Aforo" podría estar relacionada con "Membresías & Planes"
   - "Mantenimiento & Incidencias" podría estar relacionada con "Compras" (proveedores)
   - "Salas & Recursos" podría estar relacionada con "Agenda & Reservas"
   - No hay conexión clara entre secciones relacionadas

5. **Falta de indicadores visuales**:
   - No hay badges de incidencias pendientes
   - No hay alertas de aforo alcanzado
   - No hay indicadores de checklists retrasados
   - No hay contadores de mantenimientos pendientes

**Sugerencias de mejora**:
- Estandarizar rutas (todas bajo `/operaciones/` o todas bajo `/operations/`)
- Completar nombres (ej: "Documentación Interna" a "Documentación Interna y Protocolos")
- Añadir badges de notificaciones para incidencias, aforo, checklists
- Conectar con otras secciones relacionadas
- Considerar agrupar mejor (ej: todo relacionado con personal en una subsección)

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **Tasa de uso de turnos**: % de personal que tiene turnos asignados
  - Meta: >90% para gimnasios
- **Tasa de uso de checklists**: % de checklists completados a tiempo
  - Meta: >85% para gimnasios
- **Tasa de uso de control de acceso**: % de accesos registrados automáticamente
  - Meta: >80% para gimnasios con hardware
- **Tasa de reporte de incidencias**: % de incidencias reportadas dentro de 24h
  - Meta: >70% para gimnasios
- **Tasa de lectura de documentación**: % de personal que ha leído documentos críticos
  - Meta: >90% para gimnasios
- **Tasa de uso de vacaciones**: % de personal que solicita vacaciones a través del sistema
  - Meta: >80% para gimnasios

### Tiempo de tarea
- **Tiempo para crear turno**: Desde abrir modal hasta guardar turno
  - Meta: <3 minutos
- **Tiempo para reportar incidencia**: Desde detectar problema hasta reportar
  - Meta: <5 minutos
- **Tiempo para completar checklist**: Desde asignar hasta completar checklist básico
  - Meta: <15 minutos (checklist de apertura)
- **Tiempo para aprobar vacación**: Desde solicitud hasta aprobación
  - Meta: <24 horas
- **Tiempo para reservar sala**: Desde buscar hasta confirmar reserva
  - Meta: <2 minutos

### Conversión interna
- **Tasa de turnos completados**: % de turnos asignados que se completan
  - Meta: >95%
- **Tasa de incidencias resueltas**: % de incidencias que se resuelven a tiempo
  - Meta: >80%
- **Tasa de checklists completados a tiempo**: % de checklists completados antes de fecha límite
  - Meta: >85%
- **Tasa de aforo optimizado**: % de tiempo que aforo está entre 60-90% (óptimo)
  - Meta: >70%

### Errores por flujo
- **Errores en creación de turnos**: % de veces que falla la creación
  - Meta: <2%
- **Errores en reporte de incidencias**: % de veces que falla el reporte
  - Meta: <3%
- **Errores en control de acceso**: % de veces que falla el registro de acceso
  - Meta: <1%
- **Errores en checklists**: % de veces que falla la ejecución de checklist
  - Meta: <2%

### Latencia clave
- **Tiempo de actualización de aforo**: Desde cambio real hasta actualización en sistema
  - Meta: <5 segundos (tiempo real)
- **Tiempo de registro de acceso**: Desde acceso hasta registro en sistema
  - Meta: <2 segundos
- **Tiempo de carga de turnos**: Desde abrir página hasta mostrar turnos
  - Meta: <1 segundo
- **Tiempo de carga de incidencias**: Desde abrir página hasta mostrar incidencias
  - Meta: <1 segundo

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

#### 1. Integración Real con Hardware de Control de Acceso
- **RICE Score**:
  - Reach: 100% gimnasios con hardware de control de acceso
  - Impact: 10/10 (sin esto, control de acceso no tiene valor)
  - Confidence: 7/10 (requiere integración con múltiples fabricantes)
  - Effort: 10/10 (muy complejo, requiere integración con hardware, APIs externas)
  - **Score: 7.0**
- **Justificación**: Sin integración real, el control de acceso no tiene valor funcional. Es funcionalidad core.
- **Esfuerzo estimado**: 12-16 semanas (2-3 desarrolladores + DevOps + integración con fabricantes)

#### 2. Integración con Sistema de Fichajes/Control Horario Legal
- **RICE Score**:
  - Reach: 100% personal que necesita fichar
  - Impact: 10/10 (necesario para cumplimiento legal)
  - Confidence: 8/10
  - Effort: 9/10 (complejo, requiere integración con hardware/software)
  - **Score: 8.9**
- **Justificación**: Necesario para cumplimiento legal de control horario en muchos países.
- **Esfuerzo estimado**: 10-12 semanas (2 desarrolladores + integración)

#### 3. Notificaciones Automáticas de Incidencias y Alertas
- **RICE Score**:
  - Reach: 100% incidencias y alertas
  - Impact: 9/10 (permite respuesta rápida)
  - Confidence: 9/10
  - Effort: 6/10 (medio, requiere sistema de notificaciones)
  - **Score: 13.5**
- **Justificación**: Permite respuesta rápida a problemas críticos. Alto impacto con esfuerzo medio.
- **Esfuerzo estimado**: 6-8 semanas (1-2 desarrolladores)

### SHOULD (top 3)

#### 4. Sincronización Automática de Aforo con Reservas
- **RICE Score**:
  - Reach: 100% reservas que afectan aforo
  - Impact: 9/10 (evita sobreocupación)
  - Confidence: 8/10
  - Effort: 7/10 (medio/alto, requiere integración cross-module)
  - **Score: 10.3**
- **Esfuerzo estimado**: 7-9 semanas

#### 5. Validación de Solapamiento de Turnos
- **RICE Score**:
  - Reach: 100% turnos creados
  - Impact: 8/10 (evita conflictos)
  - Confidence: 9/10
  - Effort: 5/10 (medio, requiere lógica de validación)
  - **Score: 14.4**
- **Esfuerzo estimado**: 4-5 semanas

#### 6. Sistema de Aprobación de Vacaciones con Notificaciones
- **RICE Score**:
  - Reach: 100% solicitudes de vacaciones
  - Impact: 8/10 (mejora comunicación)
  - Confidence: 8/10
  - Effort: 6/10 (medio, requiere validación y notificaciones)
  - **Score: 10.7**
- **Esfuerzo estimado**: 5-6 semanas

### COULD (top 3)

#### 7. Integración con Proveedores Externos de Mantenimiento
- **RICE Score**:
  - Reach: 100% incidencias que requieren reparación externa
  - Impact: 8/10 (agiliza reparaciones)
  - Confidence: 7/10 (requiere integración con proveedores)
  - Effort: 8/10 (alto, requiere integración con múltiples proveedores)
  - **Score: 7.0**
- **Esfuerzo estimado**: 10-12 semanas

#### 8. Analytics Avanzados de Utilización de Recursos
- **RICE Score**:
  - Reach: 100% recursos gestionados
  - Impact: 7/10 (optimiza uso)
  - Confidence: 8/10
  - Effort: 7/10 (medio/alto, requiere análisis de datos)
  - **Score: 8.0**
- **Esfuerzo estimado**: 6-8 semanas

#### 9. Sistema de Validación de Checklists con Firma Digital
- **RICE Score**:
  - Reach: 100% checklists ejecutados
  - Impact: 8/10 (asegura cumplimiento)
  - Confidence: 8/10
  - Effort: 6/10 (medio, requiere validación y firma)
  - **Score: 10.7**
- **Esfuerzo estimado**: 5-6 semanas

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

#### 1. **Implementar Notificaciones Automáticas de Incidencias y Alertas (6 semanas)**
- **Acciones específicas**:
  - Sistema de notificaciones push/email/SMS
  - Alertas automáticas cuando se crea incidencia crítica
  - Notificaciones cuando aforo alcanza límite
  - Alertas cuando checklist está retrasado
  - Notificaciones cuando material está bajo stock
  - Configuración de canales de notificación por tipo de alerta
  - Preferencias de notificación por usuario
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**:
  - Sistema de notificaciones
  - Integración con email/SMS/push
  - Configuración de alertas

#### 2. **Implementar Validación de Solapamiento de Turnos (4 semanas)**
- **Acciones específicas**:
  - Validación automática al crear/editar turno
  - Detección de solapamientos entre turnos del mismo personal
  - Alertas cuando se intenta asignar turno solapado
  - Sugerencias de turnos alternativos
  - Visualización de conflictos en calendario
  - Validación de disponibilidad del personal antes de asignar
- **Responsables**: Backend developer (0.5) + Frontend developer (0.5)
- **Entregables**:
  - Sistema de validación de solapamiento
  - Alertas y sugerencias
  - Visualización de conflictos

#### 3. **Implementar Sincronización Automática de Aforo con Reservas (7 semanas)**
- **Acciones específicas**:
  - Sincronización automática entre aforo y sistema de reservas
  - Bloqueo automático de reservas cuando se alcanza aforo
  - Actualización automática de aforo cuando se cancela reserva
  - Previsión de aforo basada en reservas futuras
  - Dashboard de ocupación prevista vs real
  - Integración con módulo de reservas/agenda
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**:
  - Sistema de sincronización
  - Integración con reservas
  - Dashboard de previsión

### Riesgos y supuestos

**Riesgos identificados**:
1. **Integración con hardware puede ser compleja y costosa**:
   - Mitigación: Evaluar fabricantes compatibles, APIs documentadas, soporte técnico
   - Impacto: Alto - afecta viabilidad de control de acceso real

2. **Notificaciones excesivas pueden causar fatiga**:
   - Mitigación: Configuración granular de notificaciones, agrupación de alertas, silenciamiento temporal
   - Impacto: Medio - afecta adopción de notificaciones

3. **Validación de solapamiento puede ser demasiado restrictiva**:
   - Mitigación: Configuración de reglas flexibles, permisos para sobrescribir validaciones, excepciones
   - Impacto: Medio - afecta flexibilidad de gestión

4. **Sincronización en tiempo real puede tener problemas de latencia**:
   - Mitigación: Optimización de queries, caching, polling inteligente, WebSockets para tiempo real
   - Impacto: Medio - afecta experiencia del usuario

**Supuestos**:
- Hay módulo de reservas/agenda para sincronizar aforo
- Hay sistema de membresías para validar acceso
- Hay módulo de RRHH/nóminas para integración de fichajes
- Los gimnasios tienen hardware de control de acceso (opcional)
- Hay base de datos para almacenar turnos, incidencias, checklists, etc.
- Los usuarios tienen dispositivos móviles para ejecutar checklists (opcional)
- Hay acceso a servicios de notificaciones (email/SMS/push)

**Dependencias externas**:
- APIs de fabricantes de torniquetes/control de acceso (ej: Kisi, Paxton)
- Sistemas de fichaje (hardware o software)
- Servicios de notificaciones (email/SMS/push)
- Base de datos para almacenamiento
- Sistema de reservas/agenda
- Sistema de membresías

---

> **Notas técnicas**: 
> - Todas las rutas son relativas desde la raíz del proyecto
> - Los componentes de Turnos están en `src/features/turnos-horarios-del-staff/`
> - Los componentes de Control de Acceso están en `src/features/control-de-acceso-aforo-en-tiempo-real/`
> - Los componentes de Mantenimiento están en `src/features/mantenimiento-incidencias/`
> - Los componentes de Checklists están en `src/features/checklists-operativos-aperturacierrelimpieza/`
> - Los componentes de Recursos están en `src/features/recursos-salas-material/`
> - Los componentes de Documentación están en `src/features/documentacion-interna-y-protocolos/`
> - Las APIs están en `src/features/[Feature]/api/` o `services/`


















