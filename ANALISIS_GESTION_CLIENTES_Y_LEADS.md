# Análisis Detallado de Módulos: Gestión de Clientes y Transformación de Leads

Este documento detalla las características, funcionalidades y estructura de los módulos situados en `@src\features\gestión-de-clientes` y `@src\features\transformacion-leads`.

---

## 1. Módulo: Gestión de Clientes
**Ruta:** `src/features/gestión-de-clientes`

Este módulo funciona como un **CRM completo y avanzado** diseñado específicamente para entrenadores y gimnasios. No solo gestiona datos estáticos, sino que actúa proactivamente para mejorar la retención, fidelización y monetización de los clientes mediante gamificación, IA y automatizaciones.

### 1.1 Perfil 360º del Cliente (`Client360Profile.tsx`)
Es el núcleo de la visualización. Centraliza toda la información disponible de un cliente en una sola interfaz con múltiples pestañas:
*   **Resumen (Overview):** Métricas clave (sesiones totales, adherencia, ingresos, check-ins), datos de contacto, plan activo y estado de riesgo.
*   **Entrenamientos:** Historial de sesiones, desglose por tipos (fuerza, cardio) y notas.
*   **Hábitos (Gamificación):** Visualización de puntos, nivel del usuario, rachas y medallas.
*   **Sugerencias (IA):** Recomendaciones automáticas de sesiones basadas en fatiga y progreso.
*   **Salud (Integraciones):** Datos sincronizados de wearables (Apple Health, Google Fit, Garmin).
*   **Pagos:** Historial de transacciones y estado de facturas.
*   **Comunicación:** Chat integrado y registro de interacciones (WhatsApp, Email).
*   **Línea de Tiempo (Timeline):** Evolución visual con fotos de progreso y mediciones corporales.
*   **Objetivos:** Seguimiento de metas específicas (peso, marcas personales).
*   **Referidos:** Gestión de enlaces de afiliados propios del cliente.
*   **Nutrición Compartida:** Colaboración con nutricionistas externos.

### 1.2 Subsistemas Principales

#### A. Analítica y Retención (`analytics.ts`, `retention*.ts`)
*   **Análisis de Churn:** Tableros con métricas de clientes activos, en riesgo y perdidos. Calcula tasas de churn y retención, y visualiza los motivos principales de baja.
*   **Detector de Riesgo:** Clasifica clientes en "Activo", "En Riesgo" o "Perdido" basándose en algoritmos que analizan la última visita, la adherencia y patrones de pago.
*   **Asistente de Retención (IA):** Genera sugerencias automáticas personalizadas para evitar la baja de un cliente (ej. "El cliente X lleva 14 días sin venir, sugiérele una llamada").
*   **Alertas de Retención:** Sistema de tareas pendientes para acciones de fidelización (llamadas, mensajes).
*   **Recuperación de Clientes:** Flujos específicos para gestionar clientes perdidos e intentar reactivarlos.

#### B. Gamificación y Hábitos (`habits.ts`, `HabitsPanel.tsx`)
Sistema completo para aumentar la adherencia mediante refuerzo positivo:
*   **Sistema de Puntos y Niveles:** Los clientes ganan experiencia al completar sesiones y hábitos.
*   **Badges (Medallas):** Logros desbloqueables por hitos (ej. "Semana Completa", "100 Puntos", "Constancia").
*   **Rachas (Streaks):** Seguimiento de días consecutivos de actividad.
*   **Hábitos Personalizables:** Creación de hábitos diarios o semanales (ej. "Beber 2L de agua", "Dormir 8h").

#### C. Integraciones de Salud (`health-integrations.ts`)
Conexión con APIs de dispositivos externos para importar datos biométricos:
*   **Proveedores:** Apple Health, Google Fit, Garmin.
*   **Métricas:** Pasos, calorías, distancia, frecuencia cardíaca, sueño, peso, grasa corporal.
*   **Sincronización:** Automática o manual, con visualización de tendencias.

#### D. Gestión Administrativa y Pagos (`payment-reminders.ts`, `referrals.ts`)
*   **Recordatorios de Pago:** Automatización de avisos (Email, WhatsApp, Push) antes y después de la fecha de vencimiento de la cuota.
*   **Sistema de Referidos:** Generación de enlaces únicos por cliente. Otorga beneficios automáticos (descuentos, sesiones gratis) tanto al referidor como al referido cuando se produce una conversión.
*   **Segmentación:** Creación de grupos de clientes basados en criterios dinámicos (ej. "Clientes de alto riesgo con plan Premium").

#### E. Feedback y Comunicación (`chat.ts`, `client-feedback.ts`)
*   **Chat Interno:** Mensajería bidireccional con soporte para archivos adjuntos.
*   **Feedback de Sesiones:** Sistema para que los clientes califiquen las sesiones y dejen comentarios, permitiendo al entrenador ajustar la calidad del servicio.

#### F. Portal del Cliente (`ClientPortalPage.tsx`)
Una interfaz simplificada diseñada para el usuario final donde puede:
*   Ver y actualizar sus objetivos.
*   Gestionar sus reservas (cancelar, reprogramar).
*   Dar feedback sobre sus sesiones.

---

## 2. Módulo: Transformación de Leads
**Ruta:** `src/features/transformacion-leads`

Este módulo actúa como un **orquestador o contenedor unificado** que integra tres grandes dominios funcionales para gestionar el ciclo de vida comercial. Su objetivo es centralizar la captación y venta en una sola pantalla.

### 2.1 Página Principal (`TransformacionLeadsPage.tsx`)
Es la interfaz principal que combina los siguientes componentes:

#### A. Gestión de Leads (Integración con `features/leads`)
*   **Captura:** Botones y modales para ingresar nuevos leads manualmente.
*   **Listado y Métricas:** Visualización de leads activos, nuevos y tasas de conversión.
*   **Seguimiento:** Filtros rápidos para ver qué leads requieren atención inmediata (seguimientos programados para hoy).

#### B. Pipeline de Ventas Kanban (Integración con `features/pipeline-de-venta-kanban`)
*   **Tablero Visual:** Mueve los leads a través de fases personalizables (ej. "Contacto", "Cita Agendada", "Cierre").
*   **Automatización:** Configuración de acciones automáticas al cambiar de fase.
*   **Reportes:** Métricas específicas del embudo de ventas (valor total en pipeline, tiempo promedio de cierre).

#### C. Inbox Unificado & SLA (Integración con `features/LeadInboxUnificadoYSla`)
*   **Centralización:** Una única bandeja de entrada para Instagram, WhatsApp, Email, etc.
*   **SLA (Acuerdos de Nivel de Servicio):** Gestión de tiempos de respuesta para asegurar que ningún lead se enfríe.

### 2.2 Características Clave
*   **Adaptabilidad por Rol:** La interfaz y las métricas cambian dinámicamente si el usuario es un "Entrenador" (foco personal) o un "Gimnasio" (foco en volumen y equipo).
*   **Métricas Unificadas:** Dashboard superior que agrega datos de los tres subsistemas (Total Leads, Tasa de Conversión Global, Valor del Pipeline).
*   **Navegación por Pestañas:** Permite cambiar rápidamente entre la vista de lista (Leads), la vista de proceso (Pipeline) y la vista de comunicación (Inbox).

---

## Resumen de la Arquitectura

Ambos módulos demuestran una arquitectura madura y escalable:
1.  **Separación de Capas:**
    *   `api/`: Lógica de acceso a datos y simulación de endpoints (mocks robustos).
    *   `components/`: Componentes de UI reutilizables y específicos del dominio.
    *   `types/`: Definiciones de TypeScript estrictas para mantener la integridad de datos.
    *   `pages/`: Componentes de alto nivel que orquestan la vista.
2.  **Simulación de Backend:** Uso extensivo de `setTimeout` y datos `MOCK` en la capa de API para permitir el desarrollo frontend completo sin dependencia inmediata del backend.
3.  **Contexto de Usuario:** Uso de `useAuth` para adaptar la experiencia según el rol del usuario.
