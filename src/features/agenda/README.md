# Agenda / Calendario

Este módulo implementa la funcionalidad de Agenda/Calendario basada en el documento `notion-subpages/agenda-calendario-documentación-completa.md`.

## Análisis de Requisitos

- Vistas diferenciadas por rol:
  - Entrenador personal: agenda individual con sesiones 1 a 1, videollamadas y evaluaciones.
  - Gimnasio/Centro: agenda completa del centro con clases colectivas, horas de servicios (p. ej. fisioterapia) y evaluaciones.
- Gestión de horarios: configuración de disponibilidad y calendario de trabajo.
- Reservas y citas: creación/edición/cancelación de reservas.
- Bloqueos de agenda: días libres, vacaciones, mantenimiento.
- Recordatorios automáticos: configuración de notificaciones (mock en frontend).
- Integración con pagos: fuera de alcance backend; se deja punto de integración en API mock.
- Analytics de ocupación: métricas de uso y optimización de horarios.
- Página única con contenido/UX/datos que se adaptan al rol del usuario.

## Mapeo a Implementación

- Ruta `/agenda` protegida y envuelta por `Layout`.
- Componentes:
  - `AgendaCalendar`: calendario con vista mensual/semanal/diaria y listado de eventos.
  - `VistaPersonal` y `VistaCentro`: encapsulan reglas y UI específicas por rol.
  - `GestorHorarios`: alta/baja de disponibilidad por franjas.
  - `BloqueosAgenda`: gestión de bloqueos y vacaciones.
  - `ReservasCitas`: creación de reservas (sesiones 1:1 o clases colectivas según rol).
  - `RecordatoriosAutomaticos`: configuración de notificaciones.
  - `AnalyticsOcupacion`: métricas y tabla de ocupación.
- APIs mock:
  - `api/calendario.ts`, `api/citas.ts`, `api/disponibilidad.ts`, `api/bloqueos.ts`, `api/clases.ts`, `api/reservas.ts`, `api/analytics.ts` devuelven datos simulados diferenciados por rol.
- Uso de componentes reutilizables: `Tabs`, `TableWithActions`, `Select`, `Input`, `Modal`, `Button`, `Card`, `MetricCards`.

## Consideraciones de UX

- La navegación interna usa pestañas. La vista por defecto se ajusta al rol:
  - Entrenador: pestañas enfocadas en sesiones, clientes y disponibilidad.
  - Gimnasio: pestañas enfocadas en clases, capacidad y ocupación.
- Listados y acciones coherentes con el diseño del proyecto (clases `ds`).

## Extensión futura

- Reemplazar APIs mock por endpoints reales cuando esté disponible el backend.
- Añadir integración de pagos y comunicaciones (email/SMS/push) en las acciones de reservas y recordatorios.