# User Stories - Panel Financiero Overview (Entrenador Personal)

## US-PF-001: Configuración de Objetivos Financieros Personalizados
**Como** Entrenador Personal  
**Quiero** poder establecer mis propios objetivos financieros mensuales y anuales personalizados  
**Para** tener metas realistas adaptadas a mi situación y motivarme a alcanzarlas

**Descripción:** Permitir al entrenador configurar objetivos financieros mensuales y anuales desde el panel, reemplazando el valor hardcodeado de €5000. Mostrar progreso visual hacia el objetivo.

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-002: Registro Automático de Ingresos desde Agenda
**Como** Entrenador Personal  
**Quiero** que los ingresos de sesiones y paquetes se registren automáticamente cuando marco un pago en la agenda  
**Para** evitar duplicar trabajo y tener datos financieros precisos sin esfuerzo manual

**Descripción:** Integrar el sistema de pagos de la agenda con el panel financiero, de modo que cuando se registre un pago en una cita, este se refleje automáticamente en las métricas de ingresos.

**Feature:** `src/features/panel-financiero-overview` + `src/features/agenda-calendario`

---

## US-PF-003: Historial de Transacciones Detallado
**Como** Entrenador Personal  
**Quiero** ver un listado completo de todas mis transacciones (pagos recibidos) con fecha, cliente, concepto y monto  
**Para** tener un registro detallado de todos mis ingresos y poder consultarlo cuando lo necesite

**Descripción:** Crear una nueva pestaña o sección que muestre una tabla con todas las transacciones de ingresos, con filtros por fecha, cliente y tipo de servicio.

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-004: Análisis de Ingresos por Cliente
**Como** Entrenador Personal  
**Quiero** ver cuánto dinero me ha generado cada cliente en un período determinado  
**Para** identificar mis clientes más valiosos y enfocar mi atención adecuadamente

**Descripción:** Añadir una vista que muestre el ranking de clientes por ingresos generados, con opciones de filtrado temporal (mes actual, trimestre, año, histórico).

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-005: Envío de Recordatorios de Pago desde Alertas
**Como** Entrenador Personal  
**Quiero** enviar recordatorios de pago por WhatsApp o Email directamente desde la sección de alertas  
**Para** facilitar el cobro sin tener que cambiar de aplicación o hacer seguimientos manuales

**Descripción:** Integrar botones de acción en la tabla de pagos pendientes que permitan enviar mensajes preconfigurados por WhatsApp o Email al cliente.

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-006: Seguimiento de Cobros con Estados
**Como** Entrenador Personal  
**Quiero** poder marcar los pagos pendientes con estados (enviado recordatorio, prometió pagar, en proceso) y añadir notas  
**Para** llevar un control efectivo de las gestiones de cobro y no perder información

**Descripción:** Ampliar la funcionalidad de alertas de pagos permitiendo cambiar el estado del cobro, añadir notas y ver un historial de acciones realizadas para cada pago pendiente.

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-007: Gestión de Gastos Profesionales
**Como** Entrenador Personal  
**Quiero** poder registrar mis gastos profesionales (apps, seguros, material deportivo, formación)  
**Para** conocer mis costes reales y calcular mi beneficio neto de manera precisa

**Descripción:** Crear una nueva sección para registrar gastos con categorías predefinidas, permitir añadir gastos manualmente y ver totales por categoría y período.

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-008: Cálculo Automático de Beneficio Neto
**Como** Entrenador Personal  
**Quiero** que el sistema calcule automáticamente mi beneficio neto (ingresos - gastos)  
**Para** saber cuánto gano realmente después de descontar todos mis costes profesionales

**Descripción:** Modificar las métricas principales para mostrar tanto ingresos brutos como beneficio neto, calculando la diferencia entre ingresos registrados y gastos profesionales.

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-010: Evolución Histórica de Ingresos (Gráfico Mensual)
**Como** Entrenador Personal  
**Quiero** ver un gráfico con la evolución de mis ingresos mes a mes durante el último año  
**Para** identificar tendencias, patrones estacionales y periodos de mayor o menor actividad

**Descripción:** Reemplazar o complementar la sección de rendimiento mensual con un gráfico de línea que muestre los últimos 12 meses de ingresos.

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-011: Comparativa Año Actual vs Año Anterior
**Como** Entrenador Personal  
**Quiero** comparar mis ingresos del año actual con los del año anterior mes a mes  
**Para** evaluar si mi negocio está creciendo y en qué períodos tengo mejor rendimiento

**Descripción:** Añadir una vista de comparativa anual que superponga dos líneas (año actual y anterior) permitiendo identificar crecimiento o decrecimiento.

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-012: Análisis de Rentabilidad por Tipo de Servicio
**Como** Entrenador Personal  
**Quiero** ver qué tipo de servicio (sesiones 1a1, paquetes, online) me genera más ingresos y cuál es más rentable  
**Para** optimizar mi tiempo y enfocarme en los servicios más lucrativos

**Descripción:** Expandir la sección de Mis Ingresos con métricas adicionales: tiempo invertido por tipo de servicio, ingreso por hora, y análisis de rentabilidad.

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-014: Dashboard Simplificado con Métricas Clave
**Como** Entrenador Personal  
**Quiero** ver en la pantalla principal (Overview) solo las 4-5 métricas más importantes de forma clara  
**Para** entender rápidamente el estado de mi negocio sin información innecesaria o abrumadora

**Descripción:** Rediseñar el Overview eliminando complejidad, mostrando: ingresos del mes, ingresos pendientes de cobro, próximo objetivo, y comparativa con mes anterior.

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-015: Exportación Fiscal para Declaraciones
**Como** Entrenador Personal  
**Quiero** exportar un resumen de ingresos y gastos en formato Excel/PDF preparado para mi asesor fiscal  
**Para** facilitar mis declaraciones trimestrales y anuales sin tener que recopilar información manualmente

**Descripción:** Crear una función de exportación específica para uso fiscal que genere un documento con todos los ingresos y gastos del período seleccionado, categorizado según normativa española.

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-016: Proyección Simple Basada en Clientes Activos
**Como** Entrenador Personal  
**Quiero** ver una proyección de ingresos simple basada en mis clientes activos y su frecuencia de pago  
**Para** estimar mis ingresos del próximo mes de forma realista sin algoritmos complejos

**Descripción:** Simplificar las proyecciones financieras calculando: (número de clientes activos × precio medio × frecuencia) = ingreso esperado próximo mes.

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-017: Recordatorios Automáticos de Pago Programables
**Como** Entrenador Personal  
**Quiero** configurar recordatorios automáticos que se envíen X días antes del vencimiento de un pago  
**Para** reducir impagos y no tener que recordar manualmente enviar mensajes a cada cliente

**Descripción:** Implementar un sistema de recordatorios automáticos configurable (1, 3, 7 días antes) que envíe mensajes automáticos por WhatsApp/Email cuando se acerca una fecha de pago.

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-018: Métricas de Fidelización de Clientes
**Como** Entrenador Personal  
**Quiero** ver métricas sobre cuánto tiempo llevan mis clientes conmigo y su tasa de retención  
**Para** evaluar la calidad de mi servicio y trabajar en mejorar la fidelización

**Descripción:** Añadir una sección que muestre: antigüedad promedio de clientes, tasa de retención mensual, número de altas y bajas en el período.

**Feature:** `src/features/panel-financiero-overview`

---

## US-PF-020: Resumen de Actividad Semanal
**Como** Entrenador Personal  
**Quiero** recibir un resumen semanal automático por email con mis ingresos, pagos pendientes y próximas sesiones  
**Para** mantenerme informado de mi situación financiera sin tener que entrar constantemente al sistema

**Descripción:** Implementar un sistema de notificaciones por email que envíe cada lunes un resumen con las métricas clave de la semana anterior y alertas importantes.

**Feature:** `src/features/panel-financiero-overview`

