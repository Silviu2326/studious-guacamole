# Análisis Detallado de Módulos: Resumen, Tareas y Objetivos

Este documento detalla las características, componentes y lógica de negocio de los módulos `resumen-general`, `tareas-alertas` y `objetivos-rendimiento` basándose en el análisis del código fuente.

---

## 1. Módulo: Resumen General (`src/features/resumen-general`)

### Descripción General
Panel de control principal (Dashboard) que ofrece una vista panorámica del estado del negocio o centro deportivo. Se adapta dinámicamente según el rol del usuario (`entrenador` o `gimnasio`), mostrando métricas, alertas y accesos directos relevantes.

### Roles Soportados
*   **Entrenador:** Enfocado en gestión de clientes personales, sesiones, dietas y facturación personal.
*   **Gimnasio:** Enfocado en gestión de socios, ocupación de instalaciones, incidencias, finanzas globales y equipo.

### Componentes Principales

#### 1. `DashboardOverview`
Muestra las 4 tarjetas de métricas más importantes (KPIs) en la parte superior.
*   **Entrenador:**
    *   Clientes Activos (vs mes anterior).
    *   Ingresos del Mes (vs mes anterior).
    *   Sesiones de Hoy.
    *   Progreso Promedio (Adherencia).
*   **Gimnasio:**
    *   Socios Activos.
    *   Ocupación del Centro (con alertas de color si > 80%).
    *   Facturación del Día.
    *   Incidencias Activas (Equipos rotos/Mantenimiento).

#### 2. `QuickActions` (Accesos Rápidos)
Botones de navegación rápida a las secciones más frecuentes.
*   **Entrenador:** Mis Clientes, Agenda, Editor de Entreno, Editor de Dieta, Facturación, Leads.
*   **Gimnasio:** Gestión de Socios, Facturación & Cobros, Agenda, Panel Financiero, Pipeline Comercial, Catálogo Productos.

#### 3. `AlertsPanel`
Panel lateral que muestra alertas críticas en tiempo real.
*   **Tipos:** Error, Warning, Info, Success.
*   **Lógica:** Muestra alertas no leídas, priorizando por severidad y fecha.
*   **Ejemplos:** "Cliente sin check-in", "Equipo roto", "Aforo alto".

#### 4. `TasksWidget`
Widget de tareas del día con funcionalidad de marcado rápido (completar/desmarcar).
*   Muestra tareas pendientes prioritarias.
*   Indicadores visuales de prioridad (Alta/Media) y fecha de vencimiento.
*   Sección colapsable de tareas completadas recientemente.

#### 5. `FinancialSummary`
Resumen del estado financiero.
*   Muestra Ingresos del Mes con tendencia porcentual.
*   Desglose de Gastos y Ganancia Neta.
*   Alerta visual de vencimientos próximos y montos pendientes de cobro.

#### 6. `ClientStatus`
Desglose del estado de la base de usuarios.
*   Contadores para: Total, Activos, Nuevos, Inactivos y Leads.
*   Botón de acción rápida para gestionar leads pendientes si existen.

#### 7. `MetricsChart`
Gráfico de barras simple para visualizar tendencias semanales.
*   **Entrenador:** "Sesiones de la Semana".
*   **Gimnasio:** "Ocupación Semanal".

#### 8. `RecentActivity`
Feed de actividad cronológico.
*   Registra eventos como check-ins, pagos recibidos, sesiones programadas, nuevas membresías, etc.

---

## 2. Módulo: Tareas y Alertas (`src/features/tareas-alertas`)

### Descripción General
Sistema centralizado para la gestión de tareas, recordatorios y alertas automáticas. Incluye flujos de trabajo tipo Kanban, asignación de tareas y configuración de reglas de alerta.

### Componentes Principales

#### 1. `TasksManager`
Gestor principal de tareas.
*   **Vistas:** Lista/Tabla.
*   **Filtros:** Búsqueda por texto, Estado, Prioridad, Asignación.
*   **Funciones:** Crear, Editar, Eliminar, Marcar como completada.
*   **Métricas:** Contadores de tareas pendientes, completadas y de alta prioridad.

#### 2. `AlertsPanel` (Versión Completa)
Vista dedicada para la gestión de todas las alertas.
*   Permite marcar alertas individuales o todas como leídas.
*   Filtra alertas por rol y estado de lectura.
*   Enlaces directos a las entidades relacionadas (ej. ir al perfil del cliente desde una alerta de check-in).

#### 3. `PriorityQueue`
Vista organizada por columnas de prioridad.
*   Columnas: Alta, Media, Baja.
*   Visualización rápida de carga de trabajo por urgencia.

#### 4. `NotificationCenter`
Centro de notificaciones del sistema.
*   Diferencia entre Tareas, Alertas y Recordatorios.
*   Pestañas para ver "Sin Leer" vs "Todas".

#### 5. `TaskHistory`
Historial de auditoría de tareas.
*   Tabla con tareas completadas y canceladas.
*   Muestra fechas de finalización y creación.

#### 6. `AlertRules` (Configuración)
Interfaz para configurar reglas de generación de alertas.
*   Permite activar/desactivar tipos de alertas (ej. "Avisar si falta check-in").
*   Configuración de prioridad por defecto para cada tipo de alerta.

#### 7. `TaskAssigner` y `TaskCreator`
*   Modal para creación detallada (Título, Descripción, Prioridad, Categoría, Fecha límite, Tags).
*   Componente para reasignar tareas a otros miembros del staff (en rol Gimnasio).

### Lógica de Negocio y Tipos
*   **Prioridad:** Alta, Media, Baja. Se calcula automáticamente basándose en fecha de vencimiento (vencida/hoy = alta) o categorías críticas (pagos, mantenimiento).
*   **Estados:** Pendiente, En Progreso, Completada, Cancelada.
*   **Categorías:** Cliente, Lead, Sesión, Pago, Facturación, Mantenimiento, Aforo, etc.

---

## 3. Módulo: Objetivos y Rendimiento (`src/features/objetivos-rendimiento`)

### Descripción General
Herramienta analítica y de planificación estratégica. Permite establecer objetivos (OKRs/KPIs), monitorear su progreso en tiempo real y generar reportes.

### Componentes Principales

#### 1. `PerformanceDashboard`
Dashboard ejecutivo de rendimiento.
*   Resumen de Objetivos: Totales, Alcanzados, En Riesgo, En Progreso.
*   Gráficos de evolución temporal de métricas.
*   Distribución de estados de objetivos.
*   Tasa de éxito global.

#### 2. `ObjectivesManager`
CRUD completo de objetivos.
*   **Vistas:** Tabla y Kanban (arrastrar y soltar para cambiar estado).
*   **Estados:** No iniciado, En progreso, En riesgo, Alcanzado, Fallido.
*   **Datos:** Valor actual vs Objetivo, Fecha límite, Responsable.

#### 3. `GoalTracker`
Seguimiento detallado de objetivos individuales.
*   **Proyecciones:** Calcula si el objetivo está "En buen camino" o "Requiere atención" basándose en la velocidad de progreso actual y la fecha límite.
*   **Hitos (Milestones):** Divide el objetivo en 4 hitos automáticos para visualizar el avance.
*   **Vistas:** Tarjetas, Timeline y Análisis.

#### 4. `MetricsChart`
Visualizador de métricas flexible.
*   Tipos de gráfico: Barras, Líneas, Lista.
*   Comparativa visual de Valor Actual vs Meta (con barras de progreso y colores semánticos).
*   Filtros por categoría (Financiero, Operacional, etc.) y periodo temporal.

#### 5. `ComparisonTool`
Herramienta para comparar periodos (ej. Este mes vs Mes anterior).
*   Calcula diferencias absolutas y porcentuales.
*   Indica visualmente si el cambio es positivo o negativo (considerando la naturaleza de la métrica, ej. que baje la "Tasa de bajas" es positivo).

#### 6. `ReportsGenerator`
Generador de informes.
*   Tipos: Diario, Semanal, Mensual, Trimestral, Anual.
*   Simulación de exportación a PDF, Excel, CSV.

#### 7. `KPIConfigurator`
Configuración de métricas clave.
*   Permite definir qué KPIs son visibles y sus objetivos por defecto.
*   Activar/Desactivar métricas según el rol.

### Funcionalidades Clave
*   **Proyección Inteligente:** Algoritmo que estima el % de cumplimiento final basado en el ritmo diario actual.
*   **Alertas de Riesgo:** Marca automáticamente objetivos como "En Riesgo" si el progreso es < 50% y la fecha límite se acerca.
*   **Categorización:** Financiero (Facturación, Ingresos) vs Operacional (Adherencia, Retención, Ocupación).
