# Análisis Técnico y Funcional Profundo: Ecosistema Financiero

Este documento constituye una especificación técnica y funcional exhaustiva de los módulos financieros del sistema. Se detalla cada componente, lógica de negocio, reglas de validación y flujos de usuario implementados.

---

## 1. Módulo: Panel Financiero (Overview)
**Ubicación:** `src/features/panel-financiero-overview`

Este módulo es el "cerebro" financiero. No es una simple vista pasiva; es un motor de análisis que adapta su comportamiento y cálculos según el tipo de usuario (Entrenador Independiente vs. Gimnasio/Centro Deportivo).

### 1.1. Lógica de Adaptabilidad por Rol (Role-Based Logic)

El sistema detecta el `user.role` y reconfigura toda la interfaz y los algoritmos de cálculo:

#### A. Modo Entrenador (Micro-Economía)
Diseñado para la gestión de finanzas personales y productividad individual.
*   **Métricas Core:**
    *   **Ingresos Personales:** Suma directa de `sesiones1a1` + `paquetesEntrenamiento` + `consultasOnline`.
    *   **Promedio Diario:** Cálculo dinámico: `Total Ingresos / Días transcurridos del mes`.
    *   **Proyección Anual:** Extrapolación lineal basada en la media móvil de los últimos 3 meses.
*   **Objetivos Financieros:** Comparación en tiempo real contra una meta configurada (por defecto 5.000€/mes para entrenadores).
*   **Visualización:** Se prioriza la velocidad de cobro y la liquidez inmediata.

#### B. Modo Gimnasio (Macro-Economía)
Diseñado para gestión empresarial, costes operativos y márgenes.
*   **Métricas Core:**
    *   **Facturación Bruta:** Agregación de todas las fuentes de ingreso (Cuotas, PT, Tienda, Vending).
    *   **Costes Estructurales:** Desglose detallado de gastos fijos (Alquiler, Nómina, Suministros, Mantenimiento).
    *   **EBITDA / Beneficio Neto:** Cálculo en tiempo real: `Ingresos Totales - Costes Totales`.
*   **Análisis de Rentabilidad:**
    *   **Algoritmo de Salud:** Clasifica el estado financiero en:
        *   🟢 **Saludable:** Margen de beneficio > 20%.
        *   🟡 **Advertencia:** Margen entre 5% y 20%.
        *   🔴 **Crítico:** Margen < 5% o pérdidas.

### 1.2. Motor de Proyecciones Financieras (`proyecciones.ts`)
El sistema no solo muestra el pasado, predice el futuro utilizando un algoritmo de regresión lineal simple ajustado por estacionalidad:
1.  **Base Histórica:** Toma los ingresos de los últimos 6 meses.
2.  **Factor de Crecimiento:** Aplica un coeficiente de tendencia (ej. +3% mensual) detectado en el periodo reciente.
3.  **Variabilidad Estocástica:** Introduce una variable de incertidumbre (±5%) para generar intervalos de confianza (escenarios optimistas/pesimistas).
4.  **Output:** Gráfico de área (`AreaChart`) que visualiza visualmente el "túnel de probabilidad" de los ingresos futuros.

### 1.3. Sistema de Alertas Inteligentes (`alertas.ts`)
Un motor de monitoreo en segundo plano escanea las facturas y genera notificaciones priorizadas:
*   **Prioridad Alta (🔴):** Facturas vencidas hace >15 días o montos superiores a un umbral crítico.
*   **Prioridad Media (🟡):** Facturas por vencer en los próximos 2 días (Preventivo).
*   **Prioridad Baja (🔵):** Recordatorios administrativos generales.
*   **Resolución:** Acciones directas desde la alerta ("Enviar Recordatorio", "Marcar Pagado") sin navegar a otra pantalla.

---

## 2. Módulo: Facturación & Cobros
**Ubicación:** `src/features/facturacin-cobros`

Este módulo gestiona la operación transaccional. Su arquitectura está diseñada para minimizar la fricción en el cobro y maximizar la trazabilidad.

### 2.1. Motor de Facturación (`CreadorFactura.tsx`)
Una interfaz avanzada para la emisión de documentos fiscales y de cobro.
*   **Tipos de Ítems Soportados:**
    *   *Servicios:* Sesiones de entrenamiento, evaluaciones físicas.
    *   *Productos:* Suplementos, ropa (gestiona stock básico).
    *   *Planes/Suscripciones:* Cuotas recurrentes.
*   **Motor de Descuentos:**
    *   **Porcentual:** Aplica X% al subtotal.
    *   **Monto Fijo:** Descuenta una cantidad exacta.
    *   **Motivos Predefinidos:** "Amigo/Familiar", "Promo Verano", "Fidelidad" (útil para auditorías).
*   **Campos de Notas:**
    *   **Notas Públicas:** Visibles en el PDF para el cliente (ej. "Gracias por su compra").
    *   **Notas Internas:** Encriptadas/Ocultas, solo para el staff (ej. "Cliente conflictivo con pagos", "Acuerdo verbal de pago el día 15").

### 2.2. Gestor de Cobros y Pagos (`GestorCobros.tsx`)
Permite una gestión granular de la deuda.
*   **Pagos Parciales (Abonos):** No requiere el pago total. Permite registrar múltiples abonos a una misma factura.
    *   *Lógica:* `Monto Pendiente = Total Factura - Suma(Pagos Parciales)`.
    *   *Estados:* Si `Pagos > 0` y `Pendiente > 0` -> Estado cambia automáticamente a **"Parcial"**.
*   **Recibos Digitales Automáticos:** Al registrar un cobro, el sistema:
    1.  Genera un PDF del recibo en memoria (`jspdf`).
    2.  Calcula saldos restantes.
    3.  Envía automáticamente el recibo al email del cliente (opcional).

### 2.3. Automatización de Suscripciones (`GestorSuscripcionesRecurrentes.tsx`)
El sistema actúa como un motor de facturación recurrente (SAAS-like).
*   **Frecuencias Soportadas:** Semanal, Quincenal, Mensual, Trimestral, Anual.
*   **Trigger Automático:** Un cron job (simulado) verifica diariamente las suscripciones activas.
    *   Si `fecha_proxima_facturacion === hoy`:
        1.  Genera la nueva factura.
        2.  (Opcional) Genera un Link de Pago.
        3.  (Opcional) Envía la factura por WhatsApp/Email.
        4.  Calcula la siguiente fecha de cobro.
*   **Estados de Ciclo de Vida:** Activa -> Pausada (congela cobros) -> Cancelada -> Vencida (por impago).

### 2.4. Links de Pago y Pasarela (`linksPago.ts`)
Simulación de integración con pasarelas reales (Wompi, PayU).
*   **Tokenización:** Genera URLs únicas (`/pagar/{token_seguro}`) para cada factura.
*   **Caducidad:** Los links tienen fecha de expiración configurable (seguridad).
*   **Métodos Soportados en Link:** Tarjeta de Crédito, PSE/Transferencia.
*   **Conciliación:** Cuando el link se paga, el sistema recibe el webhook (simulado) y marca la factura como pagada automáticamente.

### 2.5. Calendario de Flujo de Caja (`CalendarioIngresos.tsx`)
Herramienta de visualización financiera temporal.
*   **Diferenciación Visual:**
    *   🟧 **Naranja:** Ingresos Esperados (Facturas emitidas pero no cobradas).
    *   🟩 **Verde:** Ingresos Reales (Dinero ya en banco/caja).
*   **Proyección de Cierre:** Calcula cuánto dinero habrá entrado a fin de mes si se cumple la tasa de cobro actual.

---

## 3. Módulo: Pagos Pendientes & Morosidad
**Ubicación:** `src/features/pagos-pendientes-morosidad`

Este es un módulo de **Recuperación de Cartera**. Transforma una lista de deudores en un CRM de cobranza inteligente.

### 3.1. Algoritmo de Clasificación de Riesgo (`ClasificadorRiesgo.tsx`)
El sistema asigna un "Scoring de Riesgo" (0-100) a cada deuda basándose en 5 factores ponderados:
1.  **Días de Retraso (30%):** Peso mayor. A más días, mayor riesgo exponencial.
2.  **Monto de la Deuda (20%):** Montos altos incrementan el riesgo financiero.
3.  **Historial de Pago (20%):** ¿Es la primera vez o es reincidente?
4.  **Frecuencia de Contacto (15%):** Si hemos contactado 5 veces sin respuesta, el riesgo sube.
5.  **Patrón de Comportamiento (15%):** Análisis de pagos anteriores.

**Niveles de Riesgo Resultantes:**
*   🛡️ **Bajo (0-30):** Deudor técnico o olvido.
*   ⚠️ **Medio (31-50):** Dificultad temporal.
*   🔥 **Alto (51-70):** Problema estructural.
*   ☠️ **Crítico (71-100):** Probable incobrable.

### 3.2. Semáforo de Morosidad (Visualización)
Categorización visual inmediata para priorizar la gestión:
*   🟢 **Verde (1-7 días):** Fase Preventiva. Acción: Recordatorio suave.
*   🟡 **Amarillo (8-15 días):** Fase Temprana. Acción: Recordatorio firme.
*   🟠 **Naranja (16-30 días):** Fase Gestión. Acción: Llamada telefónica.
*   🔴 **Rojo (>30 días):** Fase Crítica. Acción: Suspensión de servicio / Negociación.
*   ⚫ **Negro (>60 días):** Fase Legal/Castigo. Acción: Abogado / Castigo de cartera.

### 3.3. Estrategias de Cobro Automatizadas (`EstrategiasCobro.tsx`)
El sistema no solo avisa, *sugiere qué hacer*.
*   **Estrategia "Amigable":** Para clientes Verdes. Envío de email plantilla "Hola, parece que olvidaste...".
*   **Estrategia "Negociación":** Para clientes Rojos. Sugiere activar un "Plan de Pagos" o "Ajuste de Deuda".
*   **Estrategia "Legal":** Para clientes Negros. Genera un reporte para entregar a un abogado.

### 3.4. Herramientas de Recuperación (Negociación)
Funcionalidades diseñadas para recuperar el dinero sin perder al cliente:
*   **Planes de Pago (Refinanciación):**
    *   Convierte una factura vencida grande en varias cuotas pequeñas futuras.
    *   Cada cuota tiene su propia fecha de vencimiento.
    *   Congela la morosidad de la factura original mientras se cumpla el plan.
*   **Ajustes de Deuda (Quitas):**
    *   Permite "perdonar" parte de la deuda o aplicar un descuento por pronto pago.
    *   **Auditoría:** Obliga a registrar el motivo del ajuste (ej. "Descuento por desempleo temporal").
*   **Pausa de Membresía:**
    *   "Detener la hemorragia". Evita que se generen nuevas facturas mientras el cliente debe dinero.
    *   Establece una fecha automática de reactivación.

### 3.5. CRM de Cobranza (`SeguimientoPagos.tsx`)
Un "historial clínico" de la deuda.
*   **Timeline de Interacciones:** Registra cada email enviado, cada llamada realizada, cada promesa de pago rota.
*   **Notas Privadas de Contexto:** Permite al entrenador anotar información sensible (ej. "Se está divorciando", "Cambió de trabajo") para gestionar el cobro con empatía.
*   **Recordatorios de Contacto:** Agenda específica para la cobranza (ej. "El cliente pidió que lo llame el viernes a las 5 PM que es cuando cobra").

### 3.6. Integración Multicanal (WhatsApp/Email)
*   **Plantillas Dinámicas:** El mensaje de WhatsApp se pre-redacta automáticamente insertando: Nombre, Monto, Días de retraso y Link de pago.
*   **Tono Variable:** El texto de la plantilla cambia según la severidad (Amigable vs. Urgente).
*   **Cliente de Confianza (Whitelist):** Un toggle que desactiva las alertas agresivas para clientes VIP, evitando molestias innecesarias.

---

Este ecosistema cubre **todo el espectro financiero**: desde la planificación estratégica (Panel), pasando por la ejecución táctica diaria (Facturación), hasta la gestión de crisis y recuperación (Morosidad).
