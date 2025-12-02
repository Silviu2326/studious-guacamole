# Documentación Técnica Exhaustiva: Ecosistema de Gestión de Clientes y Leads

Este documento proporciona un análisis técnico y funcional profundo de los módulos `@src\features\gestión-de-clientes` y `@src\features\transformacion-leads`. Desglosa la arquitectura, modelos de datos, lógica de negocio, algoritmos de IA simulados y flujos de usuario implementados en el código.

---

# PARTE 1: GESTIÓN DE CLIENTES (CRM Avanzado)
**Directorio:** `src/features/gestión-de-clientes`

Este módulo no es un simple CRUD de usuarios. Es un **sistema de retención y fidelización 360º** diseñado para maximizar el LTV (Lifetime Value) del cliente mediante gamificación, psicología del comportamiento (hábitos) y análisis predictivo.

## 1. Arquitectura de Datos y Entidades Principales
El sistema se basa en interfaces TypeScript estrictas (`types/index.ts`, `types/*.ts`) que definen el modelo de dominio.

### 1.1 Entidad: Client (Cliente/Socio)
Define el núcleo del usuario.
*   **Estados:** `activo` | `en-riesgo` | `perdido`.
*   **Tipos:** `cliente` (Entrenador personal) | `socio` (Gimnasio).
*   **Métricas Clave:** `adherenceRate` (Tasa de cumplimiento), `riskScore` (0-100), `daysSinceLastVisit`.
*   **Financiero:** `membershipStatus`, `paymentStatus`, `metodoPagoPreferido`.

### 1.2 Entidad: Client360Profile (Perfil Extendido)
Extiende la entidad `Client` agregando capas de profundidad para la vista detallada:
*   **Historial:** Timeline de eventos (`check-in`, `session`, `payment`, `note`).
*   **Documentos:** Archivos adjuntos (consentimientos, valoraciones médicas).
*   **Métricas Agregadas:** Total de ingresos (`totalRevenue`), duración media de sesión.

---

## 2. Subsistemas Funcionales Detallados

### 2.1 Sistema de Hábitos y Gamificación (`api/habits.ts`, `HabitsPanel.tsx`)
Diseñado para "enganchar" al usuario mediante refuerzo positivo.
*   **Motor de Puntos:**
    *   Base: 10 puntos por hábito completado.
    *   Bonos: +5 por "rutina-semanal", +10 por "consistencia".
    *   **Niveles:** Sistema progresivo (Nivel 1 a Nivel X) basado en `puntosTotales`.
*   **Sistema de Badges (Insignias):**
    *   Lógica predefinida en `PREDEFINED_BADGES`.
    *   **Tipos:** Consistencia, Logros, Hitos.
    *   **Rarezas:** Común, Raro, Épico, Legendario.
    *   **Triggers:** 
        *   *Primeros Pasos:* 1 sesión completada.
        *   *Semana Completa:* 4 sesiones/semana.
        *   *Maestro de la Constancia:* 30 días consecutivos (Racha).
*   **Rachas (Streaks):** Algoritmo que calcula días consecutivos de actividad. Si `diasDiferencia > 1`, la racha se reinicia.

### 2.2 Asistente de Retención con IA (`api/retention-assistant.ts`, `RetentionAssistantPanel.tsx`)
Un motor de reglas heurísticas que simula una IA para prevenir el abandono (Churn).
*   **Algoritmo de Sugerencias:** Analiza el perfil del cliente y genera `RetentionSuggestion`.
    *   **Regla 1 (Urgente):** Si `daysSinceLastVisit > 14` -> Sugiere "Llamada de seguimiento urgente".
    *   **Regla 2 (Riesgo):** Si `riskScore > 80` -> Sugiere "Oferta de reactivación" (ej. sesiones gratis).
    *   **Regla 3 (Baja Adherencia):** Si `adherenceRate < 50%` -> Sugiere "Mensaje de motivación".
    *   **Regla 4 (Financiera):** Si `paymentStatus === 'moroso'` -> Sugiere email diplomático de cobro.
*   **Acciones Automatizadas:** Permite convertir una sugerencia directamente en una tarea programada (`RetentionAction`) de tipo email, WhatsApp o llamada.

### 2.3 Sugerencias de Sesiones Inteligentes (`api/session-suggestions.ts`)
Generación dinámica de entrenamientos basada en el contexto del usuario.
*   **Factores de Influencia:**
    *   **Fatiga/Descanso:** Si la última sesión fue intensa hace < 3 días -> Sugiere "Recuperación Activa".
    *   **Objetivos:** Si el objetivo es "Fuerza" y el progreso es bajo -> Prioriza sesión de Fuerza.
    *   **Historial:** Evita repetir el mismo grupo muscular consecutivamente (lógica de alternancia Fuerza/Cardio).
*   **Configuración:** El entrenador puede ajustar la "agresividad" de la progresión y la variedad de ejercicios.

### 2.4 Integraciones de Salud (`api/health-integrations.ts`)
Sistema de sincronización simulada con wearables.
*   **Proveedores Soportados:** Apple Health, Google Fit, Garmin.
*   **Datos Sincronizados:**
    *   Pasos, Distancia, Calorías (Actividad diaria).
    *   Frecuencia Cardíaca (Reposo, Máxima, Promedio).
    *   Sueño (Ligero, Profundo, REM).
    *   Composición corporal (Peso, % Grasa, Masa Muscular).
*   **Análisis de Tendencias:** Calcula variaciones porcentuales (ej. "+15% pasos vs semana anterior") y genera "Insights" automáticos (ej. "Tu promedio de pasos está por debajo de 10k").

### 2.5 Colaboración Nutricional (`api/nutrition-sharing.ts`)
Permite trabajar en equipo con nutricionistas externos sin dar acceso total a la cuenta.
*   **Modelo de Permisos Granular:**
    *   `puedeVer`: Solo lectura.
    *   `puedeEditar`: Modificar alimentos.
    *   `puedeAjustarMacros`: Cambiar objetivos calóricos.
    *   `puedeAsignarComidas`: Planificación diaria.
*   **Flujo de Trabajo:**
    1.  Entrenador envía invitación (`NutritionistInvitation`) vinculada a un plan o cliente.
    2.  Nutricionista acepta/rechaza.
    3.  Creación de un vínculo (`NutritionPlanShare`).
    4.  Registro de auditoría de cambios (`NutritionPlanAdjustment`) y comentarios.

### 2.6 Sistema de Referidos (`api/referrals.ts`)
Motor de marketing viral interno.
*   **Enlaces Únicos:** Generación de URLs trackeables por cliente (ej. `/referido/JUAN-123`).
*   **Doble Recompensa:** Configuración de beneficios para ambas partes. 
    *   *Referidor:* Descuento en mensualidad, días gratis.
    *   *Referido:* Matrícula gratis, descuento inicial.
*   **Tracking:** Conteo de Clicks, Registros y Conversiones (pagos realizados). Cálculo automático de ROI.

### 2.7 Finanzas y Recordatorios (`api/payment-reminders.ts`)
*   **Automatización de Cobros:**
    *   Detecta fechas de vencimiento (`nextPaymentDate`).
    *   Genera recordatorios escalonados: 7 días antes, 3 días antes, vencido.
*   **Canales:** Email, WhatsApp, SMS, Push.
*   **Lógica de Vencimiento:** Clasifica automáticamente en `upcoming`, `due-today`, `overdue`.

---

# PARTE 2: INTERFAZ DE USUARIO Y COMPONENTES
La UI está construida con una arquitectura de componentes modulares reutilizables.

## 1. Vistas Principales

### 1.1 `ClientsManager.tsx` (Gestor Principal)
El punto de entrada.
*   **Tabs:** "Activos", "En Riesgo", "Perdidos".
*   **Lógica:** Carga condicional de componentes (`ActiveClientsList`, `RiskClientsPanel`, `LostClientsManager`) para optimizar rendimiento.
*   **Manejo de Estado:** Controla qué cliente está seleccionado para abrir el perfil 360º.

### 1.2 `Client360ProfileComponent.tsx` (El "Cerebro")
Un componente masivo que orquesta **17 pestañas de información**.
*   **Header Dinámico:** Muestra avatar, riesgo (color codificado), y acciones rápidas.
*   **Pestañas Implementadas:** 
    1.  `Overview`: Dashboard resumen.
    2.  `Workouts`: Historial y métricas de entreno.
    3.  `Habits`: Panel de gamificación.
    4.  `Suggestions`: IA de entrenamiento.
    5.  `Health`: Integraciones wearables.
    6.  `Payments`: Historial financiero.
    7.  `History`: Log de actividad.
    8.  `Events`: Participación en retos.
    9.  `Metrics`: Gráficos Recharts (Adherencia, Frecuencia).
    10. `Chat`: Panel de mensajería con adjuntos.
    11. `Timeline`: Fotos y medidas.
    12. `Communication`: Logs de emails/SMS.
    13. `Goals`: Objetivos CRUD.
    14. `Photos`: Galería de progreso.
    15. `Documents`: Gestión de archivos.
    16. `Referrals`: Panel de afiliados.
    17. `Nutrition Sharing`: Colaboración externa.

### 1.3 Componentes Específicos de Alto Valor
*   **`ChatPanel.tsx`:** Implementa una interfaz tipo WhatsApp/Messenger. Soporta simulación de "En línea", adjuntos (imágenes/PDF) y scroll automático.
*   **`TimelinePanel.tsx`:** Visualización vertical cronológica. Conecta "puntos" visuales que pueden ser Fotos, Mediciones o Hitos. Calcula diferencias (deltas) entre mediciones consecutivas (ej. bajada de peso en rojo/verde).
*   **`ChurnAnalytics.tsx`:** Dashboard directivo. Muestra KPIs de negocio (Churn Rate, LTV, Retención) y gráficas de motivos de baja.

---

# PARTE 3: TRANSFORMACIÓN DE LEADS
**Directorio:** `src/features/transformacion-leads`

Este módulo es un **meta-contenedor**. No contiene lógica de negocio propia "dura", sino que orquesta y unifica tres módulos independientes para crear un flujo de ventas coherente.

## 1. Concepto de "Vista Unificada"
La página `TransformacionLeadsPage.tsx` integra:
1.  **Captura (Leads):** Entrada de datos.
2.  **Proceso (Pipeline Kanban):** Movimiento y cualificación.
3.  **Comunicación (Inbox):** Cierre y negociación.

## 2. Lógica de Adaptación de Roles
El código detecta dinámicamente si el usuario es `entrenador` o `gimnasio` y ajusta toda la interfaz:

| Característica | Rol: Entrenador | Rol: Gimnasio |
| :--- | :--- | :--- |
| **Métricas Leads** | Foco en "Pendientes de Respuesta" y "Seguimientos Hoy". | Foco en "Nuevos" (volumen) y "Tasa de Conversión" global. |
| **Métricas Pipeline** | Valor total, ticket promedio. | Total ventas masivas, eficiencia del equipo. |
| **Filtros** | Leads asignados a mí. | Leads de todo el equipo, filtrado por sedes. |
| **Tablero** | Kanban personal. | Kanban global con filtros por vendedor. |

## 3. Integraciones Técnicas
*   **MetricCards:** Utiliza un componente genérico para renderizar tarjetas de KPI, calculando los datos en tiempo real (`calculateLeadsMetrics`) basándose en fechas relativas (últimos 7 días, mes actual).
*   **Modales Compartidos:** Utiliza `useRef` (`openCaptureModalRef`) para disparar acciones en componentes hijos (abrir el modal de "Nuevo Lead" que reside dentro de `LeadsManager` desde el header principal).
*   **Navegación por Estados:** Controla la visibilidad de `LeadsManager`, `PipelineKanban` y `LeadInboxContainer` mediante un estado local `activeTab`.

---

# PARTE 4: MOCK DATA & SIMULACIÓN
Para permitir el desarrollo frontend completo sin backend, el sistema implementa una capa de API simulada robusta:
*   **Retardos de Red:** Uso de `setTimeout(resolve, 300)` en todas las llamadas asíncronas para simular latencia real y probar estados de carga (`Loading...`, `Skeletons`).
*   **Persistencia en Memoria (Runtime):** Las variables `MOCK_DATA` (arrays, maps) se modifican durante la sesión. Si creas un cliente, aparece en la lista. Si envías un mensaje, se añade al chat. Esto permite demos funcionales completas.
*   **Generadores de Datos:** Funciones auxiliares generan IDs únicos, fechas ISO y códigos de referencia aleatorios.

---

# Conclusión del Análisis
El código analizado representa una aplicación de nivel empresarial ('Enterprise-grade') en cuanto a funcionalidad frontend. Cubre no solo la gestión operativa (CRUD), sino también la estratégica (Retención, Analítica, Ventas), utilizando patrones de diseño modernos en React (Hooks, Context, Componentes Compuestos) y una tipificación fuerte en TypeScript.
