# User Stories - Impuestos & Export Contable (Enfoque Entrenador Personal)

## US-IMP-01: Gestión de Gastos Deducibles
**Como** Entrenador Personal  
**Quiero** registrar todos mis gastos deducibles con categorías claras (equipamiento, certificaciones, marketing, transporte, etc.)  
**Para** tener un control completo de mis gastos y poder deducirlos en mi declaración de impuestos  

**Descripción**: Crear un sistema de registro de gastos con categorías predefinidas relevantes para entrenadores personales. Debe incluir campos para fecha, concepto, importe, categoría, y notas opcionales.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-02: Adjuntar Recibos y Facturas a Gastos
**Como** Entrenador Personal  
**Quiero** adjuntar fotos o PDFs de mis recibos y facturas a cada gasto registrado  
**Para** tener toda la documentación justificativa organizada digitalmente y lista para Hacienda o mi gestor  

**Descripción**: Implementar funcionalidad de upload de archivos (imágenes y PDFs) asociados a cada gasto registrado. Los archivos deben almacenarse de forma segura y ser fáciles de recuperar.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-03: Cálculo Automático de Beneficio Neto
**Como** Entrenador Personal  
**Quiero** ver automáticamente mi beneficio neto (ingresos - gastos) en cada periodo  
**Para** entender cuánto dinero estoy ganando realmente después de descontar todos mis gastos  

**Descripción**: Añadir cálculo automático que reste los gastos de los ingresos y muestre el beneficio neto en el resumen fiscal. Debe actualizarse en tiempo real al registrar nuevos ingresos o gastos.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-04: Estimación de Impuestos a Pagar
**Como** Entrenador Personal  
**Quiero** ver una estimación de cuánto voy a tener que pagar en impuestos (IRPF, IVA)  
**Para** poder planificar mis finanzas y no llevarme sorpresas al hacer la declaración  

**Descripción**: Crear calculadora que estime IRPF e IVA basándose en el régimen fiscal del usuario y sus ingresos/gastos. Debe mostrar desglose claro y permitir ajustar porcentajes manualmente si es necesario.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-05: Lenguaje Simplificado y Claro
**Como** Entrenador Personal  
**Quiero** ver términos simples y claros en lugar de jerga contable técnica (manteniendo también los técnicos)  
**Para** entender perfectamente qué significa cada dato sin necesitar conocimientos de contabilidad  

**Descripción**: Reemplazar terminología técnica por lenguaje claro. Por ejemplo: "Base Imponible" → "Ingresos sin IVA", "IVA Repercutido" → "IVA Cobrado a Clientes", etc. Añadir tooltips explicativos en cada término.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-06: Recordatorios de Pagos Trimestrales
**Como** Entrenador Personal  
**Quiero** recibir recordatorios automáticos antes de las fechas de pago trimestral de impuestos  
**Para** no olvidarme nunca de presentar mis declaraciones y evitar multas  

**Descripción**: Implementar sistema de notificaciones que avise 15 días antes de cada vencimiento trimestral (Modelo 130, 303, etc.). Debe incluir calendario fiscal visible.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-07: Resumen Anual Completo
**Como** Entrenador Personal  
**Quiero** ver un resumen anual completo de todos mis ingresos, gastos, beneficios e impuestos  
**Para** tener una visión global de mi año fiscal y preparar mi declaración de la renta  

**Descripción**: Crear vista de resumen anual que agrupe toda la información fiscal del año. Debe incluir gráficos, totales desglosados por trimestre, y un informe descargable listo para el gestor.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-08: Exportación a Excel
**Como** Entrenador Personal  
**Quiero** exportar mis datos fiscales en formato Excel (.xlsx)  
**Para** poder trabajar con ellos en mi ordenador o enviarlos a mi gestor en un formato familiar  

**Descripción**: Añadir opción de exportación a formato Excel con hojas separadas para ingresos, gastos, resumen fiscal, y desglose mensual/trimestral.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-09: Gráficos de Ingresos vs Gastos
**Como** Entrenador Personal  
**Quiero** ver gráficos visuales que comparen mis ingresos con mis gastos mes a mes  
**Para** identificar rápidamente tendencias y meses donde gasto más de lo que ingreso  

**Descripción**: Implementar gráficos de barras/líneas que muestren evolución mensual de ingresos vs gastos, con posibilidad de filtrar por categoría de gasto y periodo.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-10: Desglose de Ingresos por Fuente
**Como** Entrenador Personal  
**Quiero** ver de dónde vienen mis ingresos (sesiones presenciales, online, planes nutricionales, etc.)  
**Para** entender qué servicios me generan más dinero y enfocar mi negocio  

**Descripción**: Crear visualización que categorice los ingresos por tipo de servicio o fuente. Debe integrarse con los datos de facturación y mostrar porcentajes y totales.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-11: Categorías de Gastos Predefinidas
**Como** Entrenador Personal  
**Quiero** tener categorías de gastos ya preparadas y relevantes para mi actividad  
**Para** clasificar mis gastos rápidamente sin tener que pensar en qué categoría crear  

**Descripción**: Crear conjunto de categorías predefinidas: Material deportivo, Certificaciones, Marketing, Alquiler espacio, Software/Apps, Transporte, Seguros, Formación, Otros. Permitir crear categorías personalizadas.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-12: Indicador de Gasto Deducible o No Deducible
**Como** Entrenador Personal  
**Quiero** marcar cada gasto como deducible o no deducible  
**Para** saber exactamente qué gastos puedo incluir en mi declaración y cuáles no  

**Descripción**: Añadir campo booleano "deducible" a cada gasto con ayuda contextual que explique criterios de deducibilidad. Mostrar totales separados de gastos deducibles vs no deducibles.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-13: Ayuda Contextual y Tooltips
**Como** Entrenador Personal  
**Quiero** ver iconos de ayuda y tooltips explicativos en cada campo y sección  
**Para** entender qué debo introducir y qué significa cada dato sin salir de la aplicación  

**Descripción**: Implementar sistema de ayuda contextual con iconos "?" que muestren tooltips explicativos. Incluir ejemplos prácticos en cada campo y enlaces a guías más detalladas.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-14: Comparativa Mensual de Gastos
**Como** Entrenador Personal  
**Quiero** ver una tabla que compare mis gastos mes a mes por categoría  
**Para** identificar en qué categorías estoy gastando más y controlar mejor mi presupuesto  

**Descripción**: Crear tabla comparativa mensual con gastos desglosados por categoría. Debe resaltar aumentos significativos y permitir drill-down a detalle de gastos específicos.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-15: Dashboard de Salud Financiera
**Como** Entrenador Personal  
**Quiero** ver un dashboard que me muestre de un vistazo mi situación financiera (beneficio, impuestos pendientes, margen)  
**Para** entender rápidamente si mi negocio va bien sin necesitar revisar muchos datos  

**Descripción**: Crear dashboard principal con KPIs clave: beneficio neto mensual, margen de beneficio (%), impuestos estimados pendientes, dinero disponible después de impuestos, y alertas si hay problemas.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-16: Registro Rápido de Gastos desde Mobile
**Como** Entrenador Personal  
**Quiero** poder registrar un gasto rápidamente con foto del ticket desde mi móvil  
**Para** no olvidarme de registrar gastos cuando estoy fuera y capturar el recibo inmediatamente  

**Descripción**: Optimizar interfaz para mobile con formulario simplificado de registro de gastos. Permitir captura de foto directa desde cámara y extracción automática de datos básicos (fecha, importe) si es posible.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-17: Sugerencias de Gastos Deducibles
**Como** Entrenador Personal  
**Quiero** ver sugerencias de tipos de gastos que puedo deducir según mi actividad  
**Para** asegurarme de que no estoy perdiendo oportunidades de deducción fiscal  

**Descripción**: Crear sección educativa que liste gastos típicamente deducibles para entrenadores personales con ejemplos concretos. Incluir checklist mensual de gastos a revisar.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-18: Alertas de Gastos Inusuales
**Como** Entrenador Personal  
**Quiero** recibir alertas cuando registre un gasto muy superior a mi media habitual  
**Para** detectar posibles errores en la introducción de datos o gastos excesivos  

**Descripción**: Implementar sistema de alertas que compare cada gasto con la media histórica de su categoría y notifique si supera cierto umbral (ej: 150% de la media). Permitir confirmar o corregir el gasto.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-19: Sincronización Bancaria Manual
**Como** Entrenador Personal  
**Quiero** poder importar movimientos desde un CSV de mi banco  
**Para** no tener que introducir manualmente cada transacción y ahorrar tiempo  

**Descripción**: Crear herramienta de importación de CSV bancario con mapeo de columnas configurable. Debe permitir previsualización, categorización automática sugerida, y detección de duplicados.

**Feature**: `src/features/impuestos-export-contable/`

---

## US-IMP-20: Informe "Listo para el Gestor"
**Como** Entrenador Personal  
**Quiero** generar un informe PDF completo y profesional con todos mis datos fiscales  
**Para** enviarlo directamente a mi gestor sin tener que preparar nada más  

**Descripción**: Crear generador de informe PDF profesional que incluya: resumen ejecutivo, todos los ingresos detallados, todos los gastos con recibos adjuntos, cálculos fiscales, y gráficos explicativos. Debe ser completamente auto-explicativo.

**Feature**: `src/features/impuestos-export-contable/`

