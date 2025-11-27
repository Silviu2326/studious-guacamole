# Análisis Funcional y Técnico Detallado: Agenda, Reservas y Eventos

Este documento proporciona una especificación técnica y funcional exhaustiva de los tres módulos centrales para la gestión operativa y de comunidad: **Agenda & Calendario**, **Reservas Online** y **Eventos & Retos**.

---

## 1. Módulo: Agenda & Calendario (`src/features/agenda-calendario`)

El núcleo operativo de la plataforma. No es solo un calendario visual, sino un motor de disponibilidad, finanzas y gestión de tiempo.

### 1.1 Funcionalidades Principales

#### A. Gestión de Disponibilidad y Horarios
- **Horarios de Trabajo Semanales:** Configuración granular de horas disponibles por día de la semana (ej. Lunes 09:00-14:00 y 16:00-20:00).
- **Plantillas de Horario:** Capacidad de guardar y aplicar "Horario de Verano" o "Horario Estándar" rápidamente.
- **Bloqueos de Agenda:**
  - **Tipos:** Vacaciones, Mantenimiento, Feriado, Calendario Externo.
  - **Alcance:** Bloqueo de día completo o rangos horarios específicos.
  - **Impacto:** Impide automáticamente nuevas reservas en esos huecos.

#### B. Motor de Citas y Sesiones
- **Tipos de Cita Soportados:** `sesion-1-1`, `videollamada`, `evaluacion`, `clase-colectiva`, `fisioterapia`.
- **Recurrencia Compleja:**
  - Patrones: Diario, Semanal, Quincenal, Mensual.
  - Lógica de "Serie": Edición de una ocurrencia individual o de toda la serie futura.
- **Estados de Ciclo de Vida:**
  - `pendiente` -> `confirmada` -> `en-curso` -> `completada`
  - Estados negativos: `cancelada`, `no-show` (ausencia injustificada).
- **Validaciones en Tiempo Real:** Conflicto de horarios, capacidad máxima de sala/sesión.

#### C. Integración Financiera y Proyecciones
- **Proyecciones de Ingresos:** Cálculo en tiempo real basado en la ocupación futura y precios de sesión.
- **Metas de Ocupación:** Comparativa visual entre la ocupación actual vs. meta mensual definida por el usuario.
- **Alertas de Pagos:** Identificación automática de sesiones completadas pero no pagadas ("Deuda Técnica Financiera").

#### D. Modo Offline (Offline-First)
- **Tecnología:** IndexedDB (`agenda-calendario-db`).
- **Funcionamiento:**
  - Al perder conexión, las citas se leen de la base de datos local.
  - Las acciones (crear, editar, borrar) se guardan en una cola `pending-changes`.
  - Al recuperar conexión (`onOnlineStatusChange`), se sincroniza la cola con el servidor.

### 1.2 Modelo de Datos Crítico (Types)

| Entidad | Descripción Técnica |
| :--- | :--- |
| `Recurrencia` | Define patrones de repetición (`tipo`, `diasSemana`, `fechaFin`). Fundamental para clases regulares. |
| `ConfiguracionPoliticaCancelacion` | Reglas de negocio: `tiempoMinimoCancelacionHoras`, `penalizacionNoShow`, `maxNoShowsAntesBloqueo`. |
| `ConfiguracionRecordatorios` | Orquestador de notificaciones. Define canales (`whatsapp`, `email`, `sms`) y triggers temporales (24h antes, 1h antes). |
| `ConexionCalendario` | Estado de sincronización bidireccional con Google/Outlook (`conectado`, `sincronizando`, `error`). |

---

## 2. Módulo: Reservas Online (`src/features/reservas-online`)

El motor de crecimiento y adquisición de clientes. Transforma la disponibilidad de la Agenda en oportunidades de venta.

### 2.1 Funcionalidades Principales

#### A. Enlaces de Reserva Pública
- **Personalización:** Slugs únicos por entrenador (ej. `fitcoach.app/reserva/juan-perez`).
- **Configuración de Visibilidad:**
  - Ocultar/Mostrar tipos de sesión específicos.
  - Requerir confirmación manual vs. automática.
  - Mensajes de bienvenida personalizados.

#### B. Gestión de Listas de Espera (Waitlist Engine)
- **Lógica de Asignación:**
  - Cuando una clase se llena, los usuarios entran en `ListaEspera`.
  - Al liberarse un cupo, el sistema puede:
    1. Notificar a todos (primero en llegar, primero en servir).
    2. Asignar automáticamente por prioridad (`prioridad` basada en antigüedad o tipo de cliente).
  - **Expiración:** Los cupos liberados tienen un tiempo de vida ("Hold") antes de pasar al siguiente en la lista.

#### C. Monetización y Paquetes (Bonos)
- **Bonos de Sesiones:** Venta de packs (ej. "10 Sesiones de PT").
- **Control de Saldo:**
  - `sesionesTotales` vs `sesionesUsadas`.
  - Fechas de vencimiento del bono.
  - Bloqueo automático de reservas si el bono está agotado o vencido.
- **Precios Dinámicos:** `ConfiguracionPrecios` permite variar el costo según duración (30/60 min) o modalidad (Online/Presencial).

#### D. Políticas de Cancelación y "No-Show"
- **Reglas de Penalización:**
  - Si cancela < 24h (configurable) -> Marca como "Cancelación Tardía".
  - Penalizaciones: Cobro total, descuento de sesión del bono, o bloqueo temporal de reservas.
- **Excepciones:** Capacidad de crear excepciones manuales por cliente o situación justificada.

### 2.2 Modelo de Datos Crítico (Types)

| Entidad | Descripción Técnica |
| :--- | :--- |
| `EnlacePublico` | Configuración del portal de reserva externa (`token`, `slug`, `visitas`). |
| `ListaEspera` | Cola de usuarios esperando cupo (`posicion`, `fechaSolicitud`, `estado`). |
| `BonoActivo` | Ledger de consumo de sesiones (`sesionesRestantes`, `fechaVencimiento`). |
| `PoliticaCancelacion` | Motor de reglas para anulaciones (`horasAnticipacionMinimas`, `multa`). |

---

## 3. Módulo: Eventos y Retos (`src/features/eventos-retos`)

El motor de comunidad y fidelización. Se centra en la experiencia "uno a muchos" y la gamificación a largo plazo.

### 3.1 Funcionalidades Principales

#### A. Gamificación y Progreso (Retos)
- **Sistema de Puntos:** Los participantes ganan puntos por:
  - `CheckIns` diarios.
  - Cumplimiento de métricas (ej. pasos, calorías, peso).
- **Badges y Logros:**
  - **Automáticos:** El sistema otorga medallas por hitos:
    - "Primer Paso" (Día 1).
    - "Semana Completa" (Consistencia 7 días).
    - "Mitad del Camino" (50% duración).
- **Rankings:** Tablas de clasificación en tiempo real basadas en puntos y % de completitud.

#### B. Analytics de Eventos (Event Intelligence)
- **Algoritmo de Recomendación:** `generarInsightsEventos` analiza el histórico para sugerir:
  - "El mejor día para crear un evento es el Martes a las 18:00".
  - "Los eventos tipo 'Taller' tienen un 20% más de retención".
- **Comparativas:** Dashboard visual que compara tipos de eventos (Presencial vs Virtual) en términos de asistencia y valoración (NPS).

#### C. Comunicación Automatizada (Motivation Engine)
- **Mensajería Inteligente:**
  - Envío de mensajes grupales o individuales (`whatsapp`, `email`).
  - **Variables Dinámicas:** Los mensajes pueden incluir `{progreso}`, `{diasCompletados}`, `{posicionRanking}` para ultra-personalización.
  - **Triggers:** Mensajes automáticos al alcanzar hitos o al detectar inactividad.

### 3.2 Arquitectura de Servicios (`services/`)

Este módulo utiliza una arquitectura orientada a servicios para manejar la lógica compleja:

1.  **`progresoRetosService.ts`**: El cerebro de la gamificación. Maneja la máquina de estados del progreso del usuario, verificación de logros y actualización de rankings.
2.  **`eventosAnalyticsService.ts`**: El científico de datos. Procesa arrays de eventos para extraer tendencias, calcular tasas de asistencia y generar insights de negocio.
3.  **`mensajesGrupalesService.ts`**: El comunicador. Abstrae la lógica de envío masivo y personalización de templates.

### 3.3 Modelo de Datos Crítico (Implicit & Services)

| Entidad | Descripción Técnica |
| :--- | :--- |
| `ProgresoParticipanteReto` | Estado completo del usuario en un reto (`metricas`, `logros`, `puntos`). |
| `MetricaProgreso` | Definición flexible de objetivos (numérico, booleano, porcentaje). |
| `RankingEvento` | Objeto calculado para dashboards (`tasaAsistencia`, `valoracionPromedio`). |
| `LogroReto` | Definición de medallas ganadas (`icono`, `fechaObtencion`, `tipo`). |

---

## 4. Integraciones Transversales

### A. Notificaciones Unificadas
Los tres módulos alimentan un sistema central de notificaciones que soporta:
- **Canales:** Email, SMS, WhatsApp, Push.
- **Lógica:** Respeto de horarios "No Molestar" y preferencias de usuario (`PreferenciasRecordatorioCliente`).

### B. Sincronización Externa
- La Agenda actúa como fuente de verdad, pero sincroniza bidireccionalmente con Google Calendar y Outlook para evitar conflictos con la vida personal del entrenador.

### C. Almacenamiento Local (Performance)
- Uso agresivo de `IndexedDB` para caché de eventos y citas, permitiendo una experiencia de usuario instantánea y robusta ante fallos de red.