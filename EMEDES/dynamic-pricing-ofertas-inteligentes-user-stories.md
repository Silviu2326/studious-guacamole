# User Stories - Dynamic Pricing & Ofertas Inteligentes

## US-DP-001: Plantillas Predefinidas de Reglas
**Como** Entrenador Personal  
**Quiero** acceder a plantillas predefinidas de reglas de precios (Horas Valle, Reactivación, Temporada Alta, Black Friday, etc.)  
**Para** poder crear rápidamente estrategias de precios sin necesidad de configurar todo desde cero  
**Descripción:** Incluir 8-10 plantillas con configuración pre-establecida que el entrenador pueda personalizar con un clic. Cada plantilla debe tener descripción del caso de uso y resultados esperados.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-002: Simulador de Precios en Tiempo Real
**Como** Entrenador Personal  
**Quiero** simular cómo afectarán mis reglas de precios a diferentes servicios, horarios y tipos de clientes  
**Para** ver el impacto antes de activar las reglas y evitar errores costosos  
**Descripción:** Crear un simulador visual donde se pueda seleccionar servicio, fecha, hora, tipo de cliente y ver el precio original vs precio final con la regla aplicada.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-004: Proyección de Ingresos
**Como** Entrenador Personal  
**Quiero** ver una proyección de cuántos ingresos adicionales podría generar una regla  
**Para** tomar decisiones informadas sobre qué estrategias implementar  
**Descripción:** Mostrar estimación basada en datos históricos: "Esta regla podría generar aproximadamente 300-450€ adicionales/mes basado en tus patrones de reserva". Incluir rango mínimo-máximo.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-005: Detección Automática de Conflictos
**Como** Entrenador Personal  
**Quiero** recibir alertas si dos reglas se contradicen o solapan  
**Para** evitar que se apliquen descuentos no deseados o precios incorrectos  
**Descripción:** Sistema que detecta conflictos (ej: dos reglas activas para el mismo horario) y sugiere soluciones. Mostrar advertencia visual antes de guardar.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-006: Vista de Calendario de Reglas Activas
**Como** Entrenador Personal  
**Quiero** ver un calendario mensual que muestre qué reglas están activas cada día  
**Para** tener una visión clara de mi estrategia de precios a lo largo del tiempo  
**Descripción:** Calendario visual con código de colores por tipo de regla. Al hacer clic en un día, mostrar detalle de reglas activas y precio estimado para cada servicio.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-007: Envío Automático de Ofertas Personalizadas
**Como** Entrenador Personal  
**Quiero** que cuando una regla identifique clientes elegibles, se les envíe automáticamente un email/SMS con la oferta  
**Para** no tener que hacer el seguimiento manual y aumentar las conversiones  
**Descripción:** Configurar envío automático con plantillas personalizables. Incluir tracking de aperturas y clicks. Opción de previsualizar mensaje antes de activar.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-008: Integración con Agenda - Vista de Impacto
**Como** Entrenador Personal  
**Quiero** ver en mi agenda qué sesiones tienen precios dinámicos aplicados  
**Para** entender cómo mis reglas están afectando mis reservas y horarios  
**Descripción:** Badge o indicador visual en las sesiones de la agenda que muestran "Precio dinámico aplicado" con tooltip del descuento/oferta activa.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes` + `src/features/agenda-calendario`

---

## US-DP-009: Límites y Caps de Reglas
**Como** Entrenador Personal  
**Quiero** establecer límites de uso para mis reglas (máximo de conversiones, presupuesto máximo de descuento, etc.)  
**Para** controlar el impacto financiero y evitar que una regla se use excesivamente  
**Descripción:** Opciones de configuración: máximo de usos por mes, límite de descuento total en €, máximo de clientes beneficiados. Alertas cuando se acerca al límite.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-010: Análisis Comparativo de Rendimiento
**Como** Entrenador Personal  
**Quiero** comparar el rendimiento de diferentes reglas lado a lado  
**Para** identificar qué estrategias funcionan mejor y optimizar mi pricing  
**Descripción:** Dashboard con tabla comparativa: tasa de conversión, ROI, ingresos adicionales, coste de descuento. Filtros por período. Ranking de mejores reglas.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-012: Historial Detallado por Regla
**Como** Entrenador Personal  
**Quiero** ver el historial completo de cada regla (cuándo se aplicó, a qué clientes, ingresos generados)  
**Para** analizar en detalle el rendimiento y justificar mis decisiones de pricing  
**Descripción:** Vista de detalle con timeline de activaciones, lista de conversiones con datos del cliente, gráficos de evolución temporal. Exportable a Excel/PDF.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-013: Vista de Servicios Afectados
**Como** Entrenador Personal  
**Quiero** ver claramente qué servicios están siendo afectados por cada regla  
**Para** tener control total sobre mi estrategia de precios por tipo de servicio  
**Descripción:** En la tarjeta de cada regla, mostrar lista visual de servicios afectados con precio original y nuevo. Vista global que agrupa reglas por servicio.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-014: Modo Test (A/B Testing)
**Como** Entrenador Personal  
**Quiero** poder probar dos estrategias de pricing diferentes con grupos de clientes  
**Para** descubrir qué funciona mejor antes de aplicarlo a todos  
**Descripción:** Opción de crear regla en "modo test" aplicándola solo a un % de clientes elegibles. Comparación automática de resultados después de período definido. Recomendación de ganador.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-016: Calculadora de ROI
**Como** Entrenador Personal  
**Quiero** una calculadora que me muestre el retorno de inversión de mis estrategias de pricing  
**Para** evaluar si el tiempo invertido en configurar reglas vale la pena  
**Descripción:** Dashboard que calcula: ingresos adicionales totales, costo de descuentos, ROI neto, tiempo estimado ahorrado. Comparación vs período sin precios dinámicos.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-017: Notificaciones de Resultados
**Como** Entrenador Personal  
**Quiero** recibir notificaciones cuando una regla genera conversiones importantes  
**Para** estar al tanto del impacto de mis estrategias sin tener que revisar constantemente  
**Descripción:** Notificaciones push/email configurables: "Tu regla 'Horas Valle' generó 3 nuevas reservas hoy (+90€)". Resumen semanal de rendimiento.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-018: Simplificación de Lenguaje Técnico
**Como** Entrenador Personal  
**Quiero** que la interfaz use lenguaje simple y orientado a negocios en lugar de términos técnicos  
**Para** entender fácilmente todas las opciones sin sentirme abrumado  
**Descripción:** Cambiar "Prioridad" → "Orden de aplicación", tooltips explicativos en todos los campos, ejemplos concretos en placeholders, ayuda contextual con ícono "?".  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-019: Exportación de Reportes
**Como** Entrenador Personal  
**Quiero** exportar reportes completos de mis reglas de pricing en formato Excel/PDF  
**Para** poder analizarlos fuera de la plataforma o compartirlos con mi contador  
**Descripción:** Botón "Exportar" que genera reporte con: resumen de todas las reglas, estadísticas, gráficos, historial de conversiones. Opciones de filtro por período y regla específica.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

---

## US-DP-020: Activación Programada de Reglas
**Como** Entrenador Personal  
**Quiero** programar con antelación cuándo se activarán y desactivarán mis reglas  
**Para** no tener que acordarme de hacerlo manualmente y tener estrategias planificadas  
**Descripción:** Al crear/editar regla, opciones de: "Activar automáticamente el [fecha]" y "Desactivar automáticamente el [fecha]". Vista de calendario con reglas programadas.  
**Feature:** `src/features/DynamicPricingYOfertasInteligentes`

