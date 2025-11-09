# Páginas disponibles para el rol Gimnasio

Lista generada desde `src/components/Sidebar.tsx` asumiendo `user.role === 'gimnasio'`. Las entradas marcadas con `(*)` provienen de elementos con la propiedad `gimnasioOnly: true`. Los apartados marcados con `(**)` son secciones completas exclusivas de este rol (`section.gimnasioOnly: true`).

## 1. Dashboard
- **Resumen General** — `/resumen-general`
- **Tareas & Alertas** — `/tareas-alertas`
- **Objetivos & Rendimiento** — `/objetivos-rendimiento`

## 2. CRM & Clientes
- **Clientes 360** — `/clientes-360`
- **Ventas & Leads** (*) — `/ventas-leads`

## 3. Entrenamiento
- **Suite de Entreno** — `/suite-de-entreno`
- **Adherencia & Cumplimiento** — `/adherencia`

## 4. Nutrición
- **Suite de Nutrición** — `/suite-de-nutricion`
- **Restricciones Alimentarias** — `/restricciones`
- **Alertas Restricciones** — `/alertas-restricciones-alimentarias`

## 5. Agenda & Reservas
- **Agenda & Reservas** — `/agenda-reservas`
- **Disponibilidad / Turnos** (*) — `/disponibilidad-turnos-staff`

## 6. Finanzas
- **Panel Financiero / Overview** — `/panel-financiero-overview`
- **Precios Dinámicos** — `/dashboard/monetizacion/precios-dinamicos`
- **Facturación & Cobros** — `/facturacin-cobros`
- **Pagos Pendientes / Morosidad** — `/pagos-pendientes-morosidad`
- **Suscripciones & Cuotas** — `/suscripciones-cuotas-recurrentes`
- **Gastos & Proveedores** (*) — `/gastos-proveedores`
- **Caja & Bancos** (*) — `/caja-bancos`
- **Presupuestos & Forecast** (*) — `/finanzas/presupuestos`
- **Impuestos & Export** — `/finanzas/impuestos-y-exportacion`
- **Informes Avanzados** (*) — `/finanzas/informes-avanzados`
- **Membresías & Planes** — `/membresias-planes`

## 7. Ventas / POS / Tienda
- **Catálogo de Productos** (*) — `/catalogo-productos`
- **Inventario & Stock** (*) — `/inventario-stock`
- **Pedidos & Tickets** (*) — `/pedidos-tickets`
- **Tienda Online** — `/tienda-online-checkout-online`
- **Informe de Ventas Retail** (*) — `/informe-de-ventas-retail`

## 8. Operaciones del Centro (**)
- **Turnos & Horarios** — `/turnos-horarios-del-staff`
- **Control de Acceso & Aforo** — `/control-de-acceso-aforo`
- **Mantenimiento & Incidencias** — `/mantenimiento-incidencias`
- **Checklists Operativos** — `/operations/checklists`
- **Salas & Recursos** — `/recursos-salas-material`
- **Documentación Interna** — `/operations/documents`

## 9. Compras (**)
- **Órdenes de Compra** — `/ordenes-de-compra`
- **Recepciones de Material** — `/inventario/recepciones`
- **Proveedores & Contratos** — `/admin/operaciones/proveedores`
- **Evaluación Proveedores** — `/operaciones/proveedores/evaluaciones`
- **Histórico de Costes** — `/finanzas/compras/historico-costes`

## 10. Equipo / RRHH / Nóminas (**)
- **Equipo & Roles** — `/settings/team`
- **Objetivos & Comisiones** — `/team/incentives`
- **Parte Horaria / Fichajes** — `/team/time-tracking`
- **Nóminas & Variables** — `/equipo/nominas`
- **Evaluaciones Rendimiento** — `/team/performance-reviews`

## 11. Marketing
- **Campañas & Promociones** — `/dashboard/marketing/campanas-promociones`
- **Landing Pages Simples** — `/dashboard/marketing/landing-pages-simples`
- **Gestión de Reseñas & Testimonios** — `/dashboard/marketing/resenas-testimonios`
- **Campañas Retención & Riesgo de Baja** — `/dashboard/marketing/retencion-riesgo`
- **Redes Sociales (Planner simple)** — `/dashboard/marketing/social-planner-simple`
- **Analítica de Captación** — `/dashboard/analytics/captacion`

## 12. Programas Corporativos (B2B) (**)
- **Empresas / Convenios** — `/b2b/convenios`
- **Empleados Activos** — `/corporate/companies/example-company-id/employees`
- **Uso & Resultados** — `/corporate/usage-results`
- **Facturación a Empresas** — `/corporate/billing`
- **Portal Empresa** — `/b2b/empresas-corporativas`

## 13. Multisede / Franquicias (**)
- **Resumen por Sede** — `/analytics/locations-summary`
- **Comparativa Entre Sedes** — `/analiticas/comparativa-sedes`
- **Catálogo y Precios por Sede** — `/catalogo-y-precios-por-sede`
- **Transferencias Entre Sedes** — `/multisede/transferencias`
- **Normativas y Plantillas** — `/corporate/governance/templates`

## 14. Integraciones & Automatización
- **Integraciones** — `/settings/integrations`
- **Webhooks & API Keys** (*) — `/settings/developer`
- **Importadores / Migraciones** — `/settings/data/importers`

## 15. Configuración
- **General del Centro** — `/settings/general-profile`
- **Servicios & Tarifas** — `/settings/services`
- **Políticas & Términos** (*) — `/settings/policies`
- **Plantillas Mensajes** — `/settings/templates`
- **Roles & Permisos** (*) — `/configuracion/roles-y-permisos`
- **Configuración Financiera** — `/settings/financials`

---

**Total de enlaces disponibles:** 71

**Resumen por sección:**
1. Dashboard (3)
2. CRM & Clientes (2)
3. Entrenamiento (3)
4. Nutrición (3)
5. Agenda & Reservas (2)
6. Finanzas (11)
7. Ventas / POS / Tienda (5)
8. Operaciones del Centro (6) (**)
9. Compras (5) (**)
10. Equipo / RRHH / Nóminas (5) (**)
11. Marketing (6)
12. Programas Corporativos (5) (**)
13. Multisede / Franquicias (5) (**)
14. Integraciones & Automatización (3)
15. Configuración (6)

`(*)` = enlace exclusivo del rol Gimnasio.  
`(**)` = sección completa exclusiva del rol Gimnasio.

