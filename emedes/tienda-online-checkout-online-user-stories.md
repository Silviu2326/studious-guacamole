# User Stories - Tienda Online y Checkout para Entrenador Personal

## US-01: Catálogo de servicios especializado para entrenamiento
**Como** Entrenador personal  
**Quiero** tener un catálogo con categorías específicas de entrenamiento (sesiones individuales, bonos, planes mensuales, consultas online, planes nutricionales)  
**Para** que mis clientes encuentren rápidamente el servicio que necesitan sin confusiones  

**Descripción**: Reorganizar el catálogo con categorías específicas del sector fitness, eliminando categorías genéricas de "productos físicos" y enfocándose en servicios de entrenamiento.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-02: Bonos de sesiones con descuento progresivo
**Como** Entrenador personal  
**Quiero** ofrecer bonos de 5, 10, 20 o más sesiones con descuentos automáticos según la cantidad  
**Para** incentivar la compra de paquetes grandes y asegurar ingresos recurrentes  

**Descripción**: Crear productos tipo "bono" que incluyan múltiples sesiones con precio unitario reducido. El sistema debe calcular automáticamente el descuento según cantidad.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-03: Checkout simplificado para servicios (sin envío)
**Como** Entrenador personal  
**Quiero** un proceso de checkout que solo pida datos esenciales (nombre, email, teléfono) sin dirección de envío  
**Para** agilizar la compra y no confundir a clientes con campos innecesarios  

**Descripción**: Simplificar formulario de checkout eliminando campos de dirección, código postal, ciudad para servicios que no requieren envío físico.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-04: Auto-reserva de primera sesión al comprar
**Como** Entrenador personal  
**Quiero** que al comprar una sesión o bono, el cliente pueda reservar automáticamente su primera sesión  
**Para** evitar que compren y luego no agenden, mejorando conversión y compromiso  

**Descripción**: Integrar selector de fecha/hora en el checkout o paso post-compra para que el cliente reserve inmediatamente tras pagar.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-05: Tracking de bonos y sesiones consumidas
**Como** Entrenador personal  
**Quiero** ver cuántas sesiones de un bono ha consumido cada cliente y cuántas le quedan  
**Para** controlar el uso y poder recordarles que tienen sesiones pendientes  

**Descripción**: Panel de gestión de bonos activos mostrando cliente, sesiones totales, consumidas, restantes y fecha de caducidad.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-06: Caducidad automática de bonos
**Como** Entrenador personal  
**Quiero** establecer fechas de caducidad para bonos (3-6 meses desde compra)  
**Para** evitar que los clientes acumulen sesiones indefinidamente y gestionar mejor mi planificación  

**Descripción**: Sistema de caducidad configurable por tipo de bono, con alertas automáticas 15 días antes del vencimiento.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-07: Planes de suscripción mensuales recurrentes
**Como** Entrenador personal  
**Quiero** ofrecer planes de suscripción mensual con cargo automático recurrente  
**Para** tener ingresos predecibles y fidelizar clientes a largo plazo  

**Descripción**: Crear tipo de producto "suscripción" con cobro automático mensual, gestión de renovaciones y cancelaciones.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-08: Servicios personalizables (duración, modalidad, nivel)
**Como** Entrenador personal  
**Quiero** que cada servicio tenga opciones personalizables como duración (30/60/90 min), modalidad (presencial/online) y nivel  
**Para** ofrecer flexibilidad y ajustar precios según las características elegidas  

**Descripción**: Sistema de variantes de producto con precio dinámico según selección. Por ejemplo: sesión 60min presencial vs 30min online.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-09: Checkout express en 1 click para clientes existentes
**Como** Entrenador personal  
**Quiero** que mis clientes recurrentes puedan comprar en 1 click usando datos guardados  
**Para** maximizar conversión y mejorar experiencia de usuario  

**Descripción**: Guardar datos de cliente tras primera compra y permitir checkout rápido sin rellenar formularios en compras posteriores.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-10: Enlaces de pago directo compartibles por WhatsApp
**Como** Entrenador personal  
**Quiero** generar enlaces de pago directo para servicios específicos que pueda enviar por WhatsApp o email  
**Para** cobrar rápidamente sin que el cliente navegue por toda la tienda  

**Descripción**: Botón para generar link único de pago por servicio, con descripción y precio visible. El cliente paga directamente sin registro.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-11: Códigos de descuento y promociones
**Como** Entrenador personal  
**Quiero** crear códigos promocionales con descuentos porcentuales o fijos  
**Para** hacer campañas de marketing, recompensar referidos y atraer nuevos clientes  

**Descripción**: Sistema de cupones con código alfanumérico, configuración de descuento, fecha de validez y límite de usos.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-12: QR code para cobros presenciales
**Como** Entrenador personal  
**Quiero** generar códigos QR para cada servicio que los clientes escaneen y paguen al instante  
**Para** cobrar en persona de forma profesional sin efectivo ni datáfonos  

**Descripción**: Generador de QR por servicio que al escanearse abre página de pago móvil optimizada.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-14: Precios diferenciados para clientes nuevos vs recurrentes
**Como** Entrenador personal  
**Quiero** poder ofrecer descuentos automáticos a clientes que ya compraron anteriormente  
**Para** premiar la fidelidad y aumentar retención  

**Descripción**: Sistema que detecta compras previas y aplica descuento configurable automáticamente en checkout.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-15: Valoraciones y testimonios de clientes
**Como** Entrenador personal  
**Quiero** mostrar valoraciones y comentarios de clientes satisfechos en cada servicio  
**Para** generar confianza y aumentar conversión de nuevos clientes  

**Descripción**: Sistema de reviews donde clientes pueden puntuar y comentar servicios. Se muestra promedio y últimos comentarios.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-16: Pago en cuotas para servicios premium
**Como** Entrenador personal  
**Quiero** poder ofrecer pago fraccionado en 2-3 cuotas para servicios de alto valor  
**Para** reducir barrera económica y vender planes más caros  

**Descripción**: Opción de pago diferido integrada en checkout con calendario de cobros automáticos.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-17: Bonos regalo corporativos
**Como** Entrenador personal  
**Quiero** crear bonos regalo personalizados para empresas que quieran regalar sesiones a empleados  
**Para** acceder al mercado B2B y diversificar ingresos  

**Descripción**: Modalidad de compra que genera códigos canjeables únicos por sesión, con diseño personalizable para regalo.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-18: Recordatorios automáticos de sesiones pendientes
**Como** Entrenador personal  
**Quiero** poder enviar recordatorios automáticos a clientes con bonos activos sin usar  
**Para** evitar caducidad de bonos sin consumir y mantener clientes activos  

**Descripción**: Sistema de notificaciones automáticas por email/SMS cada 2 semanas si hay sesiones sin reservar.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-19: Ofertas automáticas para clientes inactivos
**Como** Entrenador personal  
**Quiero** poder enviar ofertas especiales automáticamente a clientes que no compran hace más de 2 meses  
**Para** reactivar clientes inactivos y recuperar ingresos perdidos  

**Descripción**: Sistema de reactivación que detecta inactividad y envía cupones de descuento personalizados automáticamente.  
**Feature**: `src/features/tienda-online-checkout-online`

---

## US-20: Programa de referidos con recompensas
**Como** Entrenador personal  
**Quiero** que mis clientes puedan recomendarme y recibir descuentos cuando sus referidos compren  
**Para** crecer mediante marketing boca a boca incentivado  

**Descripción**: Sistema de referidos con links únicos por cliente. Al registrarse nuevo cliente, ambos reciben descuento configurable.  
**Feature**: `src/features/tienda-online-checkout-online`

