# Secciones y Páginas del Sidebar

Este documento contiene todas las secciones y páginas disponibles en el Sidebar de la aplicación, organizadas por categorías.

## 📋 Índice de Secciones

1. [Dashboard](#1-dashboard)
2. [CRM & Clientes](#2-crm--clientes)
3. [Entrenamiento](#3-entrenamiento)
4. [Nutrición](#4-nutrición)
5. [Agenda & Reservas](#5-agenda--reservas)
6. [Finanzas](#6-finanzas)
7. [Membresías & Planes](#7-membresías--planes)
8. [Ventas / POS / Tienda](#8-ventas--pos--tienda)
9. [Operaciones del Centro](#9-operaciones-del-centro)
10. [Compras](#10-compras)
11. [Equipo / RRHH / Nóminas](#11-equipo--rrhh--nóminas)
12. [Captura & Conversión](#12-captura--conversión)
13. [Segmentación & Automatización](#13-segmentación--automatización)
14. [Email & SMS](#14-email--sms)
15. [Contenido & Redes Sociales](#15-contenido--redes-sociales)
16. [Confianza & Social Proof](#16-confianza--social-proof)
17. [Publicidad & Retargeting](#17-publicidad--retargeting)
18. [Monetización & Ofertas](#18-monetización--ofertas)
19. [Experiencias & Eventos](#19-experiencias--eventos)
20. [Análisis & Inteligencia](#20-análisis--inteligencia)
21. [Integraciones & Partnerships](#21-integraciones--partnerships)
22. [Personalización & IA](#22-personalización--ia)
23. [Extras & Especializados](#23-extras--especializados)
24. [Marketing General](#24-marketing-general)
25. [Programas Corporativos (B2B)](#25-programas-corporativos-b2b)
26. [Multisede / Franquicias](#26-multisede--franquicias)
27. [Integraciones & Automatización](#27-integraciones--automatización)
28. [Configuración](#28-configuración)

---

## 1. Dashboard

**ID de Sección:** `dashboard`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `resumen-general` | Resumen General | `/resumen-general` | - |
| `tareas-alertas` | Tareas & Alertas | `/tareas-alertas` | - |
| `objetivos-rendimiento` | Objetivos & Rendimiento | `/objetivos-rendimiento` | - |

---

## 2. CRM & Clientes

**ID de Sección:** `crm`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `leads` | Leads | `/leads` | - |
| `lead-inbox-unificado-sla` | Inbox Unificado & SLA | `/dashboard/analytics/inbox` | - |
| `pipeline-de-venta-kanban` | Pipeline de Venta | `/pipeline-de-venta-kanban` | - |
| `gestión-de-clientes` | Mis Clientes (Entrenador) / Clientes Activos (Gimnasio) | `/gestión-de-clientes` | - |
| `clientes-en-riesgo-retencion` | Clientees en Riesgo (Entrenador) / Clientes en Riesgo / Retención (Gimnasio) | `/crm/clientes-en-riesgo` | - |
| `clientes-perdidos-bajas` | Clientes Perdidos (Entrenador) / Clientes Perdidos / Bajas (Gimnasio) | `/crm/clientes/bajas` | - |
| `portal-del-cliente-autoservicio` | Portal del Cliente | `/portal-del-cliente-autoservicio` | - |
| `encuestas-satisfaccin-npscsat` | Encuestas & Satisfacción | `/encuestas-satisfaccin-npscsat` | 🔒 Solo Gimnasio |
| `campanas-outreach` | Campañas / Outreach | `/campanas-outreach` | 🔒 Solo Gimnasio |
| `listas-inteligentes-segmentos-guardados` | Listas Inteligentes | `/listas-inteligentes-segmentos-guardados` | 🔒 Solo Gimnasio |

---

## 3. Entrenamiento

**ID de Sección:** `entrenamiento`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `programas-de-entreno` | Programas de Entreno | `/programas-de-entreno` | - |
| `editor-de-entreno` | Editor de Entreno | `/editor-de-entreno` | - |
| `plantillas-de-entrenamiento` | Plantillas de Entrenamiento | `/plantillas-de-entrenamiento` | - |
| `biblioteca-de-ejercicios` | Biblioteca de Ejercicios | `/biblioteca-de-ejercicios` | - |
| `check-ins-de-entreno` | Check-ins de Entreno | `/check-ins-de-entreno` | 👤 Solo Entrenador |
| `adherencia` | Adherencia & Cumplimiento | `/adherencia` | - |

---

## 4. Nutrición

**ID de Sección:** `nutricion`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `dietas-asignadas` | Dietas (Entrenador) / Dietas Asignadas (Gimnasio) | `/dietas-asignadas` | - |
| `editor-de-dieta-meal-planner` | Editor de Dieta | `/editor-de-dieta-meal-planner` | - |
| `plantillas-de-dieta` | Plantillas de Dieta | `/plantillas-de-dieta` | - |
| `recetario-comidas-guardadas` | Recetario | `/recetario-comidas-guardadas` | - |
| `check-ins-nutricionales` | Check-ins Nutricionales | `/check-ins-nutricionales` | 👤 Solo Entrenador |
| `lista-de-la-compra-supermercado` | Lista de la Compra | `/lista-de-la-compra-supermercado` | 👤 Solo Entrenador |
| `restricciones` | Restricciones Alimentarias | `/restricciones` | - |
| `alertas-restricciones-alimentarias` | Alertas Restricciones | `/alertas-restricciones-alimentarias` | - |

---

## 5. Agenda & Reservas

**ID de Sección:** `agenda`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `agenda` | Agenda / Calendario | `/agenda` | - |
| `reservas-online` | Reservas Online | `/reservas-online` | - |
| `lista-de-espera-ausencias` | Lista de Espera & Ausencias | `/lista-de-espera-ausencias` | 🔒 Solo Gimnasio |
| `disponibilidad-turnos-staff` | Disponibilidad / Turnos | `/disponibilidad-turnos-staff` | 🔒 Solo Gimnasio |
| `recursos-salas-material` | Recursos / Salas / Material | `/recursos-salas-material` | 🔒 Solo Gimnasio |
| `eventos-retos-especiales` | Mis Retos (Entrenador) / Eventos & Retos (Gimnasio) | `/eventos-retos-especiales` | - |
| `eventos-retos` | Eventos & Retos (Avanzado) | `/dashboard/experiencias/eventos` | - |
| `webinars-virtual-events` | Webinars & Eventos Virtuales | `/dashboard/experiences/virtual-events` | - |

---

## 6. Finanzas

**ID de Sección:** `finanzas`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `panel-financiero-overview` | Panel Financiero (Entrenador) / Panel Financiero / Overview (Gimnasio) | `/panel-financiero-overview` | - |
| `dynamic-pricing-ofertas-inteligentes` | Precios Dinámicos | `/dashboard/monetizacion/precios-dinamicos` | - |
| `facturacin-cobros` | Facturación & Cobros | `/facturacin-cobros` | - |
| `pagos-pendientes-morosidad` | Pagos Pendientes / Morosidad | `/pagos-pendientes-morosidad` | - |
| `suscripciones-cuotas-recurrentes` | Suscripciones PT (Entrenador) / Suscripciones & Cuotas (Gimnasio) | `/suscripciones-cuotas-recurrentes` | - |
| `gastos-proveedores` | Gastos & Proveedores | `/gastos-proveedores` | 🔒 Solo Gimnasio |
| `caja-bancos` | Caja & Bancos | `/caja-bancos` | 🔒 Solo Gimnasio |
| `presupuestos-forecast` | Presupuestos & Forecast | `/finanzas/presupuestos` | 🔒 Solo Gimnasio |
| `impuestos-y-exportacion` | Impuestos & Export | `/finanzas/impuestos-y-exportacion` | - |
| `informes-financieros-avanzados` | Informes Avanzados | `/finanzas/informes-avanzados` | 🔒 Solo Gimnasio |

---

## 7. Membresías & Planes

**ID de Sección:** `membresias`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|
| `catalogo-planes` | Bonos PT (Entrenador) / Catálogo de Planes (Gimnasio) | `/catalogo-planes` | - |
| `membresias-activas` | Membresías PT (Entrenador) / Membresías Activas (Gimnasio) | `/membresias-activas` | - |
| `renovaciones-bajas` | Renovaciones (Entrenador) / Renovaciones & Bajas (Gimnasio) | `/renovaciones-bajas` | - |

---

## 8. Ventas / POS / Tienda

**ID de Sección:** `ventas`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `catalogo-productos` | Catálogo de Productos | `/catalogo-productos` | 🔒 Solo Gimnasio |
| `inventario-stock` | Inventario & Stock | `/inventario-stock` | 🔒 Solo Gimnasio |
| `pedidos-tickets` | Pedidos & Tickets | `/pedidos-tickets` | 🔒 Solo Gimnasio |
| `recepciones-de-material` | Recepciones de Material | `/inventario/recepciones` | 🔒 Solo Gimnasio |
| `tienda-online-checkout-online` | Tienda de Servicios (Entrenador) / Tienda Online (Gimnasio) | `/tienda-online-checkout-online` | - |
| `informe-de-ventas-retail` | Informe de Ventas Retail | `/informe-de-ventas-retail` | 🔒 Solo Gimnasio |

---

## 9. Operaciones del Centro

**ID de Sección:** `operaciones`  
**Restricción:** 🔒 Solo Gimnasio

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `turnos-horarios-del-staff` | Turnos & Horarios | `/turnos-horarios-del-staff` | - |
| `control-de-acceso-aforo` | Control de Acceso & Aforo | `/control-de-acceso-aforo` | - |
| `mantenimiento-incidencias` | Mantenimiento & Incidencias | `/mantenimiento-incidencias` | - |
| `operations-checklists` | Checklists Operativos | `/operations/checklists` | - |
| `recursos-salas-material` | Salas & Recursos | `/recursos-salas-material` | - |
| `documentacion-interna-y-protocolos` | Documentación Interna | `/operations/documents` | - |

---

## 10. Compras

**ID de Sección:** `compras`  
**Restricción:** 🔒 Solo Gimnasio

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `ordenes-de-compra` | Órdenes de Compra | `/ordenes-de-compra` | - |
| `recepciones-de-material` | Recepciones de Material | `/inventario/recepciones` | - |
| `proveedores-contratos` | Proveedores & Contratos | `/admin/operaciones/proveedores` | - |
| `evaluacion-de-proveedores` | Evaluación Proveedores | `/operaciones/proveedores/evaluaciones` | - |
| `historico-costes` | Histórico de Costes | `/finanzas/compras/historico-costes` | - |

---

## 11. Equipo / RRHH / Nóminas

**ID de Sección:** `equipo`  
**Restricción:** 🔒 Solo Gimnasio

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `equipo-roles` | Equipo & Roles | `/settings/team` | - |
| `objetivos-comisiones` | Objetivos & Comisiones | `/team/incentives` | - |
| `parte-horaria-fichajes` | Parte Horaria / Fichajes | `/team/time-tracking` | - |
| `nominas-variables` | Nóminas & Variables | `/equipo/nominas` | - |
| `feedback-interno-y-evaluaciones-de-rendimiento` | Evaluaciones Rendimiento | `/team/performance-reviews` | - |

---

## 12. Captura & Conversión

**ID de Sección:** `captura-conversion`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `constructor-de-funnels-y-landing-pages` | Constructor de Funnels & Landing Pages | `/dashboard/marketing/funnels` | - |
| `lead-magnet-factory` | Lead Magnet Factory | `/dashboard/marketing/lead-magnets` | - |
| `progressive-profiling` | Progressive Profiling | `/dashboard/marketing/progressive-profiling` | - |
| `gestion-contenidos-premium` | Gestión de Contenidos Premium | `/dashboard/contenido-premium` | - |

---

## 13. Segmentación & Automatización

**ID de Sección:** `segmentacion-automatizacion`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `segmentacion-dinamica-audiencias` | Segmentación Dinámica & Audiencias | `/dashboard/audiencias` | - |
| `lifecycle-email-sequences` | Lifecycle Email Sequences | `/dashboard/automatizacion/secuencias-email` | - |

---

## 14. Email & SMS

**ID de Sección:** `email-sms`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `email-marketing-newsletters` | Email Marketing & Newsletters | `/dashboard/marketing/email-campaigns` | - |
| `email-deliverability-compliance-hub` | Email Deliverability & Compliance Hub | `/dashboard/email/compliance` | - |
| `sms-whatsapp-marketing` | SMS/WhatsApp Marketing | `/dashboard/marketing/mensajeria` | - |
| `sms-whatsapp-automation` | SMS/WhatsApp Automation | `/dashboard/automations/messaging` | - |
| `smsemail-preference-center` | SMS/Email Preference Center | `/client/preferences/communication` | - |

---

## 15. Contenido & Redes Sociales

**ID de Sección:** `contenido-redes-sociales`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `planner-redes-sociales` | Planner de Redes Sociales | `/dashboard/marketing/social-planner` | - |
| `generador-creativo-ia` | Generador Creativo con IA | `/dashboard/marketing/ia-generator` | - |
| `generador-estrategias-marketing` | Generador de Estrategias de Marketing con IA | `/dashboard/marketing/ia-estrategias` | - |
| `generador-ideas-contenido` | Generador de Ideas de Contenido con IA | `/dashboard/contenido/generador-ia` | - |
| `content-clipper` | Content Clipper | `/dashboard/content/clipper` | - |
| `creatorinfluencer-content-syndication` | Creator/Influencer Content Syndication | `/dashboard/marketing/influencers` | - |
| `video-studio` | Video Marketing & Automation | `/dashboard/content/video-studio` | - |
| `hub-contenidos-ugc` | Hub de Contenidos & UGC | `/dashboard/contenido/ugc-hub` | - |

---

## 16. Confianza & Social Proof

**ID de Sección:** `confianza-social-proof`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `review-testimonial-engine` | Review & Testimonial Engine | `/dashboard/reviews` | - |
| `feedback-encuestas` | Feedback Loop & Encuestas Inteligentes | `/dashboard/feedback/surveys` | - |

---

## 17. Publicidad & Retargeting

**ID de Sección:** `publicidad-retargeting`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `gestor-de-anuncios` | Gestor de Anuncios | `/dashboard/marketing/anuncios` | - |
| `retargeting-pixel-manager` | Retargeting & Pixel Manager | `/dashboard/marketing/retargeting` | - |

---

## 18. Monetización & Ofertas

**ID de Sección:** `monetizacion-ofertas`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `promociones-cupones-packs` | Promociones, Cupones & Packs | `/dashboard/monetizacion/ofertas` | - |
| `dynamic-pricing-ofertas-inteligentes` | Dynamic Pricing & Ofertas Inteligentes | `/dashboard/monetizacion/precios-dinamicos` | - |
| `loyalty-program-manager` | Loyalty Program Manager | `/dashboard/monetizacion/loyalty` | - |
| `referidos-afiliados` | Referidos & Afiliados | `/dashboard/marketing/referrals` | - |
| `marketing-de-referidos` | Referral Marketing | `/dashboard/monetizacion/referidos` | - |

---

## 19. Experiencias & Eventos

**ID de Sección:** `experiencias-eventos`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `webinars-virtual-events` | Webinars & Virtual Events Manager | `/dashboard/experiences/virtual-events` | - |
| `eventos-retos` | Eventos & Retos | `/dashboard/experiencias/eventos` | - |
| `community-engagement` | Community & Engagement | `/comunidad` | - |

---

## 20. Análisis & Inteligencia

**ID de Sección:** `analisis-inteligencia`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `lead-inbox-unificado-sla` | Lead Inbox Unificado & SLA | `/dashboard/analytics/inbox` | - |
| `libreria-campanas-playbooks` | Librería de Campañas (Playbooks) | `/dashboard/intelligence/playbooks` | - |
| `trend-analizer` | Trend Analizer | `/dashboard/intelligence/trend-analyzer` | - |
| `analitica-de-adquisicion` | Analítica de Adquisición | `/analytics/acquisition` | - |

---

## 21. Integraciones & Partnerships

**ID de Sección:** `integraciones-partnerships`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `partnerships-influencers` | Partnerships & Influencers | `/dashboard/partnerships` | - |
| `account-based-marketing` | Account-Based Marketing (ABM) | `/abm` | - |

---

## 22. Personalización & IA

**ID de Sección:** `personalizacion-ia`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `personalization-engine-ia-avanzada` | Personalization Engine (IA avanzada) | `/dashboard/ia/personalization-engine` | - |

---

## 23. Extras & Especializados

**ID de Sección:** `extras-especializados`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `ab-testing-experimentacion` | A/B Testing & Experimentación | `/marketing/ab-testing` | - |
| `competitive-analysis-market-intelligence` | Competitive Analysis & Market Intelligence | `/market-intelligence` | - |

---

## 24. Marketing General

**ID de Sección:** `marketing-general`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `campanas-outreach` | Campañas | `/campanas-outreach` | 🔒 Solo Gimnasio |
| `embudos-ofertas-landing-pages` | Embudos & Landing Pages | `/marketing/landing-pages` | - |
| `afiliados-y-referidos` | Afiliados & Referidos | `/marketing/afiliados-y-referidos` | - |

---

## 25. Programas Corporativos (B2B)

**ID de Sección:** `b2b`  
**Restricción:** 🔒 Solo Gimnasio

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `empresas-convenios` | Empresas / Convenios | `/b2b/convenios` | - |
| `empleados-activos` | Empleados Activos | `/corporate/companies/example-company-id/employees` | - |
| `uso-resultados-programas-corporativos` | Uso & Resultados | `/corporate/usage-results` | - |
| `facturacion-a-empresas` | Facturación a Empresas | `/corporate/billing` | - |
| `portal-empresa` | Portal Empresa | `/b2b/empresas-corporativas` | - |

---

## 26. Multisede / Franquicias

**ID de Sección:** `multisede`  
**Restricción:** 🔒 Solo Gimnasio

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `resumen-por-sede` | Resumen por Sede | `/analytics/locations-summary` | - |
| `comparativa-entre-sedes` | Comparativa Entre Sedes | `/analiticas/comparativa-sedes` | - |
| `catalogo-y-precios-por-sede` | Catálogo y Precios por Sede | `/catalogo-y-precios-por-sede` | - |
| `transferencias-entre-sedes` | Transferencias Entre Sedes | `/multisede/transferencias` | - |
| `normativa-y-plantillas-globales` | Normativas y Plantillas | `/corporate/governance/templates` | - |

---

## 27. Integraciones & Automatización

**ID de Sección:** `integraciones`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `integraciones-y-automatizacion` | Integraciones | `/settings/integrations` | - |
| `webhooks-api-keys` | Webhooks & API Keys | `/settings/developer` | 🔒 Solo Gimnasio |
| `importadores-migraciones` | Importar Clientes (Entrenador) / Importadores / Migraciones (Gimnasio) | `/settings/data/importers` | - |

---

## 28. Configuración

**ID de Sección:** `configuracion`

### Páginas:

| ID | Label | Path | Restricciones |
|---|---|---|---|
| `general-del-centro-marca-personal` | Marca Personal (Entrenador) / General del Centro (Gimnasio) | `/settings/general-profile` | - |
| `servicios-tarifas` | Servicios & Tarifas | `/settings/services` | - |
| `politicas-terminos` | Políticas & Términos | `/settings/policies` | 🔒 Solo Gimnasio |
| `plantillas-de-mensajes-y-contratos` | Plantillas Mensajes | `/settings/templates` | - |
| `roles-permisos` | Roles & Permisos | `/configuracion/roles-y-permisos` | 🔒 Solo Gimnasio |
| `moneda-impuestos-series-de-factura` | Configuración Fiscal (Entrenador) / Configuración Financiera (Gimnasio) | `/settings/financials` | - |

---

## 📊 Resumen Estadístico

### Total de Secciones: 28
### Total de Páginas: 150+

### Distribución por Restricciones:

- **Páginas sin restricción:** Disponibles para todos los usuarios
- **🔒 Solo Gimnasio:** Páginas disponibles solo para usuarios de gimnasio
- **👤 Solo Entrenador:** Páginas disponibles solo para entrenadores
- **Etiquetas dinámicas:** Algunas páginas muestran diferentes labels según el tipo de usuario (Entrenador vs Gimnasio)

### Secciones con Restricción Completa:

- **Operaciones del Centro:** Solo Gimnasio
- **Compras:** Solo Gimnasio
- **Equipo / RRHH / Nóminas:** Solo Gimnasio
- **Programas Corporativos (B2B):** Solo Gimnasio
- **Multisede / Franquicias:** Solo Gimnasio

---

## 🔍 Notas Importantes

1. **Labels dinámicos:** Algunas páginas muestran diferentes textos según el rol del usuario:
   - Entrenador: "Mis Clientes", "Bonos PT", "Membresías PT", etc.
   - Gimnasio: "Clientes Activos", "Catálogo de Planes", "Membresías Activas", etc.

2. **Paths duplicados:** Algunas páginas comparten el mismo path pero tienen diferentes IDs. Esto puede requerir revisión:
   - `recursos-salas-material` aparece en múltiples secciones con el mismo path
   - `recepciones-de-material` aparece en múltiples secciones

3. **Secciones expandidas por defecto:** Las siguientes secciones están expandidas por defecto:
   - `dashboard`
   - `crm`
   - `captura-conversion`

4. **Rutas de navegación:** Los paths utilizan el sistema de routing de React Router, por lo que deben coincidir con las rutas definidas en el enrutador principal de la aplicación.

---

*Última actualización: Generado automáticamente desde Sidebar.tsx*
















