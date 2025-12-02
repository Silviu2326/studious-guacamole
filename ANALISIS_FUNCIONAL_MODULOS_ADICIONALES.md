# Especificación Funcional y Técnica Detallada: Ecosistema Financiero y de Fidelización

Este documento constituye la referencia técnica definitiva para los módulos de **Impuestos**, **Catálogo**, **Suscripciones** y **Renovaciones**. Se detalla no solo *qué* hace el sistema, sino la *lógica de negocio* subyacente, los flujos de datos y las capacidades específicas por rol (Entrenador Personal vs. Gimnasio).

---

## 1. Módulo: Impuestos y Exportación Contable
**Directorio:** `@src\features\impuestos-export-contable`

Este módulo actúa como un ERP financiero ligero, automatizando la obligación tributaria y el control de gastos mediante algoritmos de estimación y conciliación.

### 1.1. Funcionalidades Detalladas

#### A. Calculadora Fiscal en Tiempo Real (`TaxCalculator.tsx`)
No es una simple calculadora estática, es un motor reactivo que se ajusta al perfil del usuario.
*   **Lógica de Estimación de IVA:**
    *   Calcula el **IVA Repercutido** (cobrado a clientes) basándose en los ingresos brutos.
    *   Calcula el **IVA Deducible** (pagado en gastos) aplicando un factor de estimación (configurable, por defecto 70%) sobre los gastos registrados.
    *   **Resultado:** `IVA Neto = Repercutido - Deducible`.
*   **Lógica de IRPF (Autónomos):**
    *   Permite configurar el porcentaje de retención (ej. 15%).
    *   **Base Imponible:** Se calcula dinámicamente según el régimen:
        *   *General:* `Ingresos - Gastos`.
        *   *Simplificado:* Aplica coeficientes reductores automáticos (ej. 5% para gastos de difícil justificación).
*   **Visualización de Flujo de Caja:** Muestra el "Dinero Disponible Real" (Net Profit) descontando las provisiones de impuestos para evitar problemas de liquidez futuros.

#### B. Conciliación Bancaria Inteligente (`BankCSVImport.tsx`)
Sistema ETL (Extract, Transform, Load) para movimientos bancarios.
*   **Parsing Agnóstico:** Capaz de leer CSVs de diferentes bancos detectando automáticamente delimitadores (`,`, `;`) y formatos de fecha (`DD/MM/YYYY`, `YYYY-MM-DD`).
*   **Algoritmo de Sugerencia de Categorías:**
    *   Analiza el texto del "Concepto" buscando palabras clave (ej. "Uber" -> Transporte, "Adobe" -> Software).
    *   Asigna un **Score de Confianza** (0-1). Si la confianza es alta, pre-selecciona la categoría; si es baja, pide confirmación manual.
*   **Prevención de Duplicados:** Compara cada línea del CSV con la base de datos existente utilizando una clave compuesta (`Fecha` + `Importe` + `Concepto Fuzzy`) para evitar registrar el mismo gasto dos veces.

#### C. Detección de Anomalías en Gastos (`useExpenseAlerts.ts`)
Sistema de auditoría interna automatizada.
*   **Cálculo de Media Histórica:** Analiza los gastos de los últimos 12 meses agrupados por categoría.
*   **Disparador de Alerta:** Si un nuevo gasto supera un umbral (por defecto 150%) sobre la media de su categoría, el sistema bloquea el guardado rápido y muestra un modal de advertencia ("Gasto Anómalo") para confirmar si es correcto o un error de tecleo.

#### D. Calendario y Obligaciones Fiscales (`FiscalCalendar.tsx`)
*   **Modelos Soportados:** Genera hitos para Modelo 130 (IRPF Trimestral) y Modelo 303 (IVA Trimestral).
*   **Lógica de Vencimiento:** Calcula dinámicamente las fechas límite oficiales (20 de Abril, Julio, Octubre, Enero) y genera notificaciones con prioridad escalada:
    *   *> 15 días:* Informativo.
    *   *< 7 días:* Advertencia (Amarillo).
    *   *Vencido:* Alerta Crítica (Rojo).

#### E. Exportación Profesional (`ExportControlsContainer.tsx`)
Genera entregables listos para la gestoría o software de terceros.
*   **Formatos Soportados:**
    *   **Excel (.xlsx):** Hoja multicapa (Resumen, Desglose Ingresos, Desglose Gastos).
    *   **A3con / Sage 50:** Formatos estructurados específicos para importación directa en software contable de asesorías.
    *   **PDF:** Reportes visuales con gráficas de distribución de costes.

---

## 2. Módulo: Catálogo de Planes y Servicios
**Directorio:** `@src\features\catalogo-planes`

Motor de configuración de productos que define las reglas de negocio para las suscripciones.

### 2.1. Funcionalidades Detalladas

#### A. Arquitectura de Producto Dual
El sistema adapta sus campos según el rol:
*   **Bonos PT (Entrenador):**
    *   Define **Volumen de Sesiones** (ej. 8 sesiones).
    *   Define **Validez Temporal** (ej. caduca en 2 meses).
    *   Cálculo automático de "Precio por Sesión" para mostrar valor al cliente.
*   **Membresías (Gimnasio):**
    *   Define **Nivel de Acceso** (Básico, Premium, VIP).
    *   Define **Instalaciones Incluidas** (Sala, Spa, Piscina).
    *   Flag de "Clases Ilimitadas".

#### B. Gestor de Bonos Activos (`GestorBonos.tsx`)
Panel de control para el seguimiento del consumo.
*   **Visualización de Progreso:** Barra de progreso visual que muestra `Sesiones Usadas / Sesiones Totales`.
*   **Estados Automáticos:**
    *   *Activo:* Tiene sesiones y fecha válida.
    *   *Agotado:* Sesiones = 0.
    *   *Vencido:* Fecha actual > Fecha validez.
    *   *Próximo a Vencer:* Alerta visual amarilla cuando quedan < 30 días.

---

## 3. Módulo: Suscripciones y Cuotas Recurrentes
**Directorio:** `@src\features\suscripciones-cuotas-recurrentes`

El núcleo transaccional. Gestiona la relación contractual y el ciclo de vida del cliente.

### 3.1. Gestión Avanzada del Ciclo de Vida

#### A. Lógica de "Freeze" (Congelación) (`FreezeSuscripcion.tsx`)
Permite pausar una suscripción sin penalizar al cliente ni perder ingresos futuros.
*   **Cálculo de Extensión:** Al activar un freeze por 15 días, el sistema calcula automáticamente la nueva `Fecha de Vencimiento` sumando esos 15 días a la fecha original.
*   **Reanudación Automática:** Un proceso en segundo plano (`verificarReanudacionesAutomaticas`) revisa diariamente si un freeze ha caducado para reactivar la suscripción y los cobros recurrentes.

#### B. Transferencia de Sesiones (Roll-Over) (`TransferenciaSesiones.tsx`)
Característica premium para Entrenadores Personales.
*   **Lógica:** Permite mover el saldo de `sesionesDisponibles` no gastadas del mes actual al mes siguiente.
*   **Configuración:** Puede ser manual (a petición) o automática (regla de negocio).
*   **Límites:** Se puede establecer un `maxSesionesTransferibles` (ej. máximo 2 acumulables) para evitar pasivos incontrolables.

#### C. Suscripciones Grupales / Familiares (`SuscripcionesGrupales.tsx`)
*   **Estructura Padre-Hijo:** Una suscripción "Madre" es responsable del pago. Múltiples clientes "Hijos" consumen el servicio.
*   **Descuentos por Volumen:** Aplica reglas automáticas (ej. -10% si son 3 miembros).
*   **Gestión de Miembros:** Interfaz para añadir/remover beneficiarios sin alterar la facturación principal.

#### D. Gestión de Pagos y Recurrencia (`GestorCuotas.tsx`)
*   **Gestión de Fallos:** Flujo de trabajo para pagos rechazados (`GestionPagosFallidos`):
    1.  Reintento automático.
    2.  Solicitud de cambio de método de pago.
    3.  Marcado manual como "pagado en efectivo/transferencia".
*   **Proyecciones (`ProyeccionesIngresosRetencion`):** Algoritmo que proyecta el *Cash Flow* a 3/6/12 meses basándose en:
    *   Ingresos Confirmados (Suscripciones vigentes).
    *   Ingresos Probables (Renovaciones estimadas según tasa de retención histórica).
    *   Riesgo de Fuga (Ingresos en peligro).

#### E. Modificaciones de Plan
*   **Upgrade/Downgrade:**
    *   *Inmediato:* Cobra la diferencia prorrateada y actualiza las sesiones/acceso al instante.
    *   *Al Vencimiento:* Programa el cambio para el siguiente ciclo de facturación.
*   **Sesiones Bonus:** Permite inyectar sesiones gratuitas (fidelización) que no afectan al conteo del plan base ni al precio de renovación.

---

## 4. Módulo: Renovaciones y Bajas (Churn Management)
**Directorio:** `@src\features\renovaciones-bajas`

Sistema estratégico diseñado para maximizar el LTV (Lifetime Value) y minimizar el Churn.

### 4.1. Funcionalidades Detalladas

#### A. Motor de Alertas de Renovación (`AlertasVencimiento.tsx`)
Sistema proactivo que escanea suscripciones diariamente.
*   **Triggers:** Genera alertas a los 30, 15, 7 y 1 día antes del vencimiento.
*   **Semáforo de Prioridad:**
    *   *Alta:* Bonos con < 2 sesiones o Vencimiento < 3 días.
    *   *Media:* Vencimiento < 15 días.
*   **Acciones Directas:** Desde la alerta permite enviar recordatorios pre-configurados por WhatsApp/Email o procesar la renovación en un clic.

#### B. Flujo de Retención ("Propuesta de Cambio")
Antes de que un cliente cancele o no renueve:
*   Permite crear una **Propuesta Personalizada** (`PropuestaCambioRenovacion`):
    *   Descuento temporal.
    *   Cambio a un plan más económico (Downgrade preventivo).
    *   Añadido de sesiones extra.
*   Estas propuestas quedan registradas y tienen estado (Pendiente, Aceptada, Rechazada).

#### C. Gestión de Bajas y Análisis de Churn (`AnalisisChurn.tsx`)
*   **Baja Estructurada:** No permite "borrar" un cliente. Exige procesar una "Baja" seleccionando un motivo estandarizado (Precio, Salud, Competencia, Mudanza, etc.).
*   **Analytics de Fugas:**
    *   **Tasa de Churn:** `(Bajas del periodo / Total Clientes Iniciales) * 100`.
    *   **Pareto de Motivos:** Identifica qué causa el 80% de las bajas (ej. "El 40% se va por Precio").
    *   **Tendencia:** Gráfica lineal comparativa mes a mes.

#### D. Scoring de Riesgo de Cliente (`MetricasCompromiso.tsx`)
Algoritmo predictivo que asigna un nivel de riesgo (Bajo, Medio, Alto, Crítico) a cada cliente basándose en:
*   **Patrón de Asistencia:** ¿Ha dejado de venir en las últimas 2 semanas?
*   **Uso de Sesiones:** ¿Tiene muchas sesiones acumuladas sin gastar?
*   **Historial de Pagos:** ¿Suele fallar el primer intento de cobro?
*   **Antigüedad:** Los clientes nuevos (< 3 meses) tienen mayor riesgo base.

---

## Resumen de Integración Técnica

Estos módulos no funcionan aislados, comparten un flujo de datos continuo:

1.  **Configuración:** Se crean los planes en el **Catálogo**.
2.  **Venta:** Se crea una **Suscripción** basada en un Plan.
3.  **Cobro:** La suscripción genera **Cuotas**. Al pagarse, estas cuotas se inyectan en el módulo de **Impuestos** como Ingresos.
4.  **Consumo:** El uso del servicio actualiza el estado de la Suscripción (sesiones restantes).
5.  **Riesgo:** Si el consumo baja, el módulo de **Renovaciones** marca "Riesgo Alto".
6.  **Retención:** Se activan alertas de renovación o propuestas de cambio.
7.  **Fin de Ciclo:** Si renueva, se generan nuevas cuotas. Si cancela, se alimenta el análisis de Churn.