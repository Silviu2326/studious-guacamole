# Documentación Técnica y Funcional: Módulos Financieros

Este documento detalla las características, funcionalidades y capacidades técnicas de los módulos financieros del sistema: **Panel Financiero (Overview)**, **Facturación & Cobros** y **Pagos Pendientes & Morosidad**.

---

## 1. Panel Financiero (Overview)
**Ruta:** `src/features/panel-financiero-overview`

Este módulo actúa como el cuadro de mando central para la salud financiera del negocio. Su característica principal es la **adaptabilidad por rol**, ofreciendo métricas distintas para **Entrenadores Independientes** vs. **Gimnasios/Centros**.

### Características Principales

#### 1.1. Adaptabilidad por Rol
*   **Modo Entrenador:**
    *   Se enfoca en "Ingresos Personales".
    *   Desglose por: Sesiones 1 a 1, Paquetes de Entrenamiento y Consultas Online.
    *   Calcula el promedio diario de ingresos y proyecciones basadas en la productividad individual.
    *   Metas financieras ajustadas a escala personal.
*   **Modo Gimnasio:**
    *   Se enfoca en "Facturación Total del Centro".
    *   Desglose por líneas de negocio: Cuotas de Socios, Entrenamiento Personal (PT), Tienda y Servicios Adicionales.
    *   Incluye análisis de **Costes Estructurales** (Alquiler, Salarios, Equipamiento, Servicios).
    *   Cálculo de **Rentabilidad** y Margen de Beneficio.

#### 1.2. Visualización de Datos
*   **Métricas en Tiempo Real:** Tarjetas de resumen con indicadores de tendencia (Crecimiento/Decrecimiento) comparado con el periodo anterior.
*   **Gráficos Interactivos:**
    *   Distribución de ingresos (Gráfico Circular).
    *   Comparativa de fuentes de ingreso (Gráfico de Barras).
    *   Proyecciones financieras a 6 meses (Gráfico de Área) con intervalos de confianza.

#### 1.3. Proyecciones y Análisis
*   **Proyecciones Financieras:** Algoritmo que estima los ingresos futuros a 6 meses basándose en el histórico y la tendencia actual.
*   **Análisis de Rentabilidad (Solo Gym):** Calcula ingresos totales vs. costes totales para determinar el beneficio neto y el estado de salud financiera (Saludable, Advertencia, Crítico).

#### 1.4. Sistema de Alertas y Reportes
*   **Alertas de Pagos:** Visualización rápida de facturas vencidas, por vencer y recordatorios pendientes, clasificados por prioridad.
*   **Reportes Personalizados:** Motor para generar reportes específicos (Resumen, Ingresos, Gastos) con filtros de fecha y opción de exportación/guardado.

---

## 2. Facturación & Cobros
**Ruta:** `src/features/facturacin-cobros`

Este es el motor operativo financiero. Gestiona el ciclo de vida completo de una transacción, desde la creación de la factura hasta la confirmación del recaudo y la conciliación.

### Funcionalidades Core

#### 2.1. Gestión de Facturas
*   **Creador de Facturas:** Interfaz para generar facturas con soporte para múltiples tipos de ítems (Servicios, Productos, Planes, Eventos).
    *   Soporte para descuentos (Porcentaje, Monto fijo, Motivos predefinidos).
    *   Cálculo automático de impuestos (IVA).
    *   Notas públicas (cliente) y notas internas (privadas).
*   **Plantillas de Servicios:** Catálogo predefinido de servicios (ej. "Sesión Individual", "Pack 10 Sesiones") para facturación rápida.
*   **Seguimiento de Estados:** Flujo completo: Pendiente -> Parcial -> Pagada -> Vencida -> Cancelada.

#### 2.2. Suscripciones y Pagos Recurrentes (Automatización)
*   **Motor de Suscripciones:** Permite configurar cobros automáticos con frecuencias variadas (Semanal, Quincenal, Mensual, Trimestral, Anual).
*   **Facturación Automática:** Genera facturas automáticamente en la fecha de corte.
*   **Envío Automático:** Opción para enviar la factura y el link de pago por Email o WhatsApp automáticamente al generarse.

#### 2.3. Gestión de Cobros y Pagos
*   **Links de Pago:** Generación de enlaces de pago únicos (simulación de integración Wompi/PayU) que pueden enviarse al cliente.
*   **Pagos Parciales:** Soporte para registrar abonos a una factura, actualizando el saldo pendiente automáticamente.
*   **Recibos Digitales:** Generación automática de PDFs de recibos de caja y envío por correo tras registrar un pago.
*   **Modal de Pago Rápido:** Interfaz simplificada para registrar pagos en efectivo o transferencia al instante.

#### 2.4. Calendario de Ingresos (Cash Flow)
*   **Vista de Calendario:** Visualización de ingresos diarios.
*   **Proyección de Flujo de Caja:** Diferencia visual entre "Ingresos Esperados" (Facturas pendientes por vencer) e "Ingresos Reales" (Cobros confirmados).
*   **Métricas de Cumplimiento:** Comparativa de proyección fin de mes vs. realidad actual.

#### 2.5. Integración con Paquetes Prepago
*   **Facturación Automática de Citas:** Al finalizar una cita en la agenda, el sistema detecta si el cliente tiene paquetes activos.
    *   Si tiene paquete: Descuenta la sesión y genera factura en $0.
    *   Si no tiene paquete: Genera factura por el valor de la sesión individual.

---

## 3. Pagos Pendientes & Morosidad
**Ruta:** `src/features/pagos-pendientes-morosidad`

Este módulo está diseñado específicamente para la **recuperación de cartera**. Transforma la lista de deudores en un sistema de gestión de relaciones (CRM) enfocado en el cobro.

### Funcionalidades Avanzadas de Cobro

#### 3.1. Clasificación de Riesgo y Morosidad
*   **Semáforo de Morosidad:** Clasificación visual de la deuda:
    *   🟢 **Verde:** 1-7 días (Recordatorio preventivo).
    *   🟡 **Amarillo:** 8-15 días (Gestión temprana).
    *   🟠 **Naranja:** 16-30 días (Riesgo medio).
    *   🔴 **Rojo:** >30 días (Riesgo alto).
    *   ⚫ **Negro:** >60 días (Gestión legal/incobrable).
*   **Scoring de Riesgo:** Algoritmo que calcula la probabilidad de impago (0-100) basándose en el historial, monto y días de retraso.

#### 3.2. Estrategias de Cobro Diferenciadas
*   **Estrategias Automatizadas:** El sistema sugiere o ejecuta acciones según el nivel de riesgo:
    *   *Recordatorio Automático:* Emails suaves.
    *   *Contacto Directo:* Script para llamadas o WhatsApp.
    *   *Negociación:* Propuestas de acuerdos de pago.
    *   *Legal:* Escalado a instancias jurídicas.

#### 3.3. Gestión de Acuerdos y Planes de Pago
*   **Planes de Pago (Cuotas):** Capacidad de reestructurar una deuda vencida en un nuevo plan de cuotas con fechas de vencimiento específicas.
*   **Ajustes de Deuda:** Funcionalidad controlada para aplicar descuentos por pronto pago o condonaciones parciales, registrando siempre el motivo (auditoría).
*   **Pausa de Membresía:** Opción para congelar el acceso o la generación de nuevas facturas mientras el cliente regulariza su situación.

#### 3.4. CRM de Cobranza (Seguimiento)
*   **Timeline de Acciones:** Historial cronológico de todas las interacciones con el deudor (Llamadas, Emails, Promesas de pago, Abonos).
*   **Notas Privadas:** Espacio para que el entrenador registre contextos delicados (ej. "Cliente perdió empleo, esperar hasta fin de mes").
*   **Recordatorios de Contacto:** Agenda específica para llamadas de cobro ("Llamar el martes a las 10am").

#### 3.5. Comunicación Multicanal
*   **Integración WhatsApp:** Plantillas de mensajes predefinidas según el nivel de confianza y días de mora, con link directo a la API de WhatsApp.
*   **Toggle "Cliente de Confianza":** Permite marcar clientes VIP para reducir la agresividad de las alertas y notificaciones automáticas.

---

## Resumen de Integración

Estos tres módulos funcionan de manera orquestada:
1.  **Panel Financiero** da la visión estratégica y las alertas tempranas.
2.  **Facturación** gestiona la operación diaria, crea la deuda y recauda lo "normal".
3.  **Morosidad** entra en acción cuando el flujo normal falla, proveyendo herramientas específicas para recuperar el dinero sin romper la relación con el cliente.
