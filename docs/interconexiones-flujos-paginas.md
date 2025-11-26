# Interconexiones y Flujos entre Páginas

Este documento detalla las posibles interconexiones y flujos de navegación entre las diferentes páginas del sistema, identificando relaciones lógicas de negocio que permiten crear una experiencia de usuario fluida.

---

## 📋 Índice

1. [Flujos Centrados en Clientes](#1-flujos-centrados-en-clientes)
2. [Flujos de Entrenamiento y Nutrición](#2-flujos-de-entrenamiento-y-nutrición)
3. [Flujos de Ventas y Finanzas](#3-flujos-de-ventas-y-finanzas)
4. [Flujos de Marketing y Captura](#4-flujos-de-marketing-y-captura)
5. [Flujos Operativos](#5-flujos-operativos)
6. [Flujos de Agenda y Eventos](#6-flujos-de-agenda-y-eventos)
7. [Flujos de Análisis e Inteligencia](#7-flujos-de-análisis-e-inteligencia)
8. [Flujos Transversales](#8-flujos-transversales-multi-sección)
9. [Flujos Avanzados y Complejos](#9-flujos-avanzados-y-complejos)
10. [Flujos de Marketing Avanzado](#10-flujos-de-marketing-avanzado)
11. [Flujos de Integraciones y Automatización](#11-flujos-de-integraciones-y-automatización)
12. [Flujos de Análisis y Reportes](#12-flujos-de-análisis-y-reportes)
13. [Flujos de B2B y Corporativos](#13-flujos-de-b2b-y-corporativos)
14. [Flujos de Multisede](#14-flujos-de-multisede)
15. [Flujos de Configuración y Settings](#15-flujos-de-configuración-y-settings)
16. [Flujos de Notificaciones y Alertas](#16-flujos-de-notificaciones-y-alertas)
17. [Flujos de Búsqueda y Navegación](#17-flujos-de-búsqueda-y-navegación)
18. [Flujos de Reportes y Exportación](#18-flujos-de-reportes-y-exportación)
19. [Flujos Condicionales y Automáticos](#19-flujos-condicionales-y-automáticos)
20. [Flujos de Analytics y Dashboards](#20-flujos-de-analytics-y-dashboards)

---

## 1. Flujos Centrados en Clientes

### 1.1 Clientes ↔ Dietas

**Interconexión Principal:**
- **Desde Clientes → Dietas:** En la vista de un cliente, mostrar botón/enlace a "Ver Dietas Asignadas"
- **Desde Dietas → Clientes:** En la lista de dietas, cada dieta muestra los clientes asignados (clickeable para ir al perfil del cliente)

**Casos de Uso:**
- Ver todas las dietas de un cliente específico
- Ver todos los clientes que tienen una dieta específica asignada
- Asignar nueva dieta desde el perfil del cliente
- Editar dieta desde el perfil del cliente
- Ver historial de dietas de un cliente

**Implementación sugerida:**
```
Clientes → [Perfil cliente] → [Tab "Dietas"] → Lista de dietas → Click en dieta → Ver detalle
Dietas → [Vista dieta] → [Sección "Clientes asignados"] → Lista de clientes → Click en cliente → Perfil cliente
Clientes → [Perfil cliente] → [Botón "Asignar nueva dieta"] → Modal/Formulario → Crear/Asignar dieta
```

---

### 1.2 Clientes ↔ Programas de Entreno

**Interconexión Principal:**
- **Desde Clientes → Entrenamientos:** Ver todos los programas de entrenamiento asignados a un cliente
- **Desde Entrenamientos → Clientes:** Ver todos los clientes que están en un programa específico

**Casos de Uso:**
- Ver progreso del cliente en sus programas de entrenamiento
- Asignar nuevo programa desde el perfil del cliente
- Ver qué clientes están siguiendo un programa popular
- Comparar resultados de clientes en el mismo programa

**Implementación sugerida:**
```
Clientes → [Perfil cliente] → [Tab "Entrenamientos"] → Lista de programas → Click en programa → Ver detalle
Programas de Entreno → [Vista programa] → [Tab "Participantes"] → Lista de clientes → Click en cliente → Perfil
Clientes → [Perfil cliente] → [Botón "Asignar programa"] → Seleccionar programa → Confirmar
```

---

### 1.3 Clientes ↔ Agenda

**Interconexión Principal:**
- **Desde Clientes → Agenda:** Ver todas las citas de un cliente
- **Desde Agenda → Clientes:** Ver perfil del cliente desde una cita

**Casos de Uso:**
- Ver historial completo de citas de un cliente
- Programar nueva cita desde el perfil del cliente
- Ver próximas citas del cliente
- Cancelar/reprogramar cita desde el perfil del cliente

**Implementación sugerida:**
```
Clientes → [Perfil cliente] → [Tab "Citas"] → Lista de citas → Click en cita → Ver en agenda
Agenda → [Vista cita] → [Click en nombre del cliente] → Perfil del cliente
Clientes → [Perfil cliente] → [Botón "Nueva cita"] → Formulario → Crear cita en agenda
```

---

### 1.4 Clientes ↔ Facturación

**Interconexión Principal:**
- **Desde Clientes → Facturación:** Ver historial de pagos y facturas de un cliente
- **Desde Facturación → Clientes:** Ver perfil del cliente desde una factura

**Casos de Uso:**
- Ver estado de pago del cliente
- Ver facturas pendientes de un cliente
- Generar nueva factura desde el perfil del cliente
- Ver historial completo de transacciones

**Implementación sugerida:**
```
Clientes → [Perfil cliente] → [Tab "Pagos"] → Lista de facturas → Click en factura → Ver detalle
Facturación → [Vista factura] → [Click en nombre del cliente] → Perfil del cliente
Clientes → [Perfil cliente] → [Botón "Nueva factura"] → Formulario → Generar factura
```

---

### 1.5 Clientes ↔ Check-ins

**Interconexión Principal:**
- **Desde Clientes → Check-ins:** Ver historial de check-ins de un cliente
- **Desde Check-ins → Clientes:** Ver perfil del cliente desde un check-in

**Casos de Uso:**
- Ver frecuencia de asistencia del cliente
- Ver últimas actividades registradas
- Ver evolución del cliente a lo largo del tiempo
- Identificar patrones de asistencia

**Implementación sugerida:**
```
Clientes → [Perfil cliente] → [Tab "Check-ins"] → Lista de check-ins → Click en check-in → Ver detalle
Check-ins → [Vista check-in] → [Click en nombre del cliente] → Perfil del cliente
Check-ins → [Gráfico de asistencia] → [Click en punto] → Filtrar check-ins del cliente en esa fecha
```

---

### 1.6 Clientes ↔ Adherencia

**Interconexión Principal:**
- **Desde Clientes → Adherencia:** Ver nivel de adherencia del cliente a dietas y entrenamientos
- **Desde Adherencia → Clientes:** Ver lista de clientes por nivel de adherencia

**Casos de Uso:**
- Ver si el cliente está siguiendo su plan correctamente
- Identificar clientes con baja adherencia para intervención
- Comparar adherencia entre diferentes clientes
- Ver tendencias de adherencia a lo largo del tiempo

**Implementación sugerida:**
```
Clientes → [Perfil cliente] → [Métrica "Adherencia"] → Click → Ver detalle completo de adherencia
Adherencia → [Vista general] → [Filtro por cliente] → Ver adherencia específica
Adherencia → [Lista de clientes] → Ordenados por adherencia → Click en cliente → Perfil
Clientes → [Si adherencia baja] → [Alerta] → Sugerir acciones de mejora
```

---

## 2. Flujos de Entrenamiento y Nutrición

### 2.1 Dietas ↔ Programas de Entreno

**Interconexión Principal:**
- Las dietas y programas de entrenamiento se complementan en planes integrales

**Casos de Uso:**
- Ver planes completos que incluyen dieta + entrenamiento
- Crear plan combinado para un cliente
- Sincronizar objetivos entre dieta y entrenamiento
- Ver efectividad de combinaciones dieta+entrenamiento

**Implementación sugerida:**
```
Dietas → [Vista dieta] → [Sección "Entrenamientos complementarios"] → Links a programas relacionados
Programas de Entreno → [Vista programa] → [Sección "Dietas recomendadas"] → Links a dietas
Crear Plan Completo → [Wizard] → Paso 1: Seleccionar dieta → Paso 2: Seleccionar entrenamiento → Asignar a cliente
```

---

### 2.2 Dietas ↔ Check-ins

**Interconexión Principal:**
- Los check-ins pueden incluir seguimiento de dieta

**Casos de Uso:**
- Registrar adherencia a dieta en check-in
- Ver historial de seguimiento de dieta en check-ins
- Identificar días en que el cliente no siguió la dieta
- Comparar resultados físicos con adherencia a dieta

**Implementación sugerida:**
```
Check-ins → [Formulario check-in] → [Pregunta "¿Seguiste la dieta hoy?"] → Guardar
Dietas → [Vista dieta] → [Tab "Check-ins relacionados"] → Ver check-ins que mencionan esta dieta
Check-ins → [Si adherencia baja] → [Alerta] → Sugerir revisar dieta en perfil del cliente
```

---

## 3. Flujos de Ventas y Finanzas

### 3.1 Leads ↔ Pipeline de Venta

**Interconexión Principal:**
- Los leads se gestionan a través del pipeline de venta

**Casos de Uso:**
- Mover lead entre etapas del pipeline
- Ver leads en cada etapa del pipeline
- Analizar conversión por etapa
- Identificar cuellos de botella en el proceso de venta

**Implementación sugerida:**
```
Leads → [Vista lead] → [Estado] → Cambiar etapa → Actualizar en Pipeline
Pipeline de Venta → [Etapa] → [Cards de leads] → Click en card → Ver detalle del lead
Pipeline → [Analytics] → [Tasa de conversión por etapa] → Identificar problemas
Pipeline → [Lead en etapa final] → [Botón "Convertir a cliente"] → Crear cliente
```

---

### 3.2 Pipeline de Venta ↔ Clientes

**Interconexión Principal:**
- Los leads del pipeline se convierten en clientes

**Casos de Uso:**
- Convertir lead calificado en cliente
- Ver historial de conversión de lead a cliente
- Analizar qué leads se convierten mejor
- Seguir up con leads que no se convirtieron

**Implementación sugerida:**
```
Pipeline → [Lead en etapa "Calificado"] → [Botón "Convertir"] → Modal → Confirmar → Crear cliente
Clientes → [Perfil cliente] → [Sección "Origen"] → Link al lead en pipeline (histórico)
Pipeline → [Analytics] → [Leads convertidos] → Ver lista → Click → Ver cliente creado
```

---

## 4. Flujos de Marketing y Captura

### 4.1 Landing Pages ↔ Leads

**Interconexión Principal:**
- Las landing pages capturan leads que entran al sistema

**Casos de Uso:**
- Ver leads generados por cada landing page
- Analizar tasa de conversión de landing pages
- Optimizar landing page basado en leads generados
- A/B testing de landing pages

**Implementación sugerida:**
```
Landing Pages → [Vista landing] → [Métrica "Leads generados"] → Click → Ver leads (filtrado por source)
Leads → [Vista lead] → [Campo "Origen"] → Si es landing page → Link a landing page
Landing Pages → [Analytics] → [Conversión] → Ver leads convertidos en clientes
Landing Pages → [A/B Test] → [Comparar] → Ver qué variante genera más leads
```

---

## 5. Flujos Operativos

### 5.1 Agenda ↔ Clientes

**Interconexión Principal:**
- Las citas en agenda están vinculadas a clientes

**Casos de Uso:**
- Ver todas las citas de un cliente
- Programar nueva cita desde perfil de cliente
- Ver disponibilidad del cliente
- Cancelar/reprogramar cita

**Implementación sugerida:**
```
Agenda → [Vista cita] → [Click en cliente] → Perfil del cliente
Clientes → [Perfil cliente] → [Tab "Citas"] → Ver citas pasadas y futuras → Click → Ver en agenda
Clientes → [Perfil cliente] → [Botón "Nueva cita"] → Formulario → Crear cita
Agenda → [Si cita cancelada] → [Notificar cliente] → Actualizar en perfil
```

---

## 6. Flujos de Agenda y Eventos

### 6.1 Agenda ↔ Múltiples Tipos de Citas

**Interconexión Principal:**
- La agenda gestiona diferentes tipos de eventos y citas

**Casos de Uso:**
- Ver citas de entrenamiento, nutrición, consulta, etc.
- Filtrar agenda por tipo de cita
- Programar diferentes tipos de servicios
- Ver disponibilidad por tipo de servicio

**Implementación sugerida:**
```
Agenda → [Filtros] → [Tipo de cita] → Filtrar vista
Agenda → [Crear cita] → [Seleccionar tipo] → Formulario adaptado al tipo
Servicios & Tarifas → [Vista servicio] → [Disponibilidad] → Ver en agenda
Agenda → [Vista cita] → [Tipo] → Link a servicio relacionado
```

---

## 7. Flujos de Análisis e Inteligencia

### 7.1 Resumen General ↔ Todas las Secciones

**Interconexión Principal:**
- Dashboard central con métricas de todas las secciones

**Casos de Uso:**
- Ver overview completo del negocio
- Navegar a secciones específicas desde métricas
- Identificar áreas que necesitan atención
- Comparar períodos

**Implementación sugerida:**
```
Resumen General → [Cada métrica/widget] → [Click] → Navegar a sección correspondiente con filtros
Resumen → [Gráfico] → [Click en punto] → Drill-down a detalle
Resumen → [Alertas] → [Click] → Ir a Tareas & Alertas
Resumen → [Comparar] → [Seleccionar períodos] → Ver diferencias
```

---

## 8. Flujos Transversales (Multi-Sección)

### 8.1 Vista 360° del Cliente

**Interconexión Principal:**
- El perfil del cliente conecta con todas las secciones relacionadas

**Casos de Uso:**
- Ver información completa del cliente en un solo lugar
- Navegar fácilmente entre secciones relacionadas
- Tomar acciones rápidas desde el perfil
- Ver timeline completo del cliente

**Implementación sugerida:**
```
Clientes → [Perfil cliente] → [Tabs/Vista 360°]:
  - Overview: Resumen general
  - Dietas: Ver y gestionar dietas
  - Entrenamientos: Ver y gestionar programas
  - Citas: Ver historial y programar
  - Pagos: Ver facturación
  - Check-ins: Ver historial
  - Adherencia: Ver métricas
  - Contratos: Ver y gestionar
  - Timeline: Vista cronológica de todos los eventos
  - Notas: Información adicional
```

---

### 8.2 Flujo Completo: Lead → Cliente → Servicio

**Interconexión Principal:**
- Flujo end-to-end desde captura hasta servicio activo

**Casos de Uso:**
- Seguir un lead completo hasta cliente activo
- Ver todas las etapas del proceso
- Identificar cuellos de botella
- Optimizar proceso completo

**Implementación sugerida:**
```
1. Landing Page → Captura Lead
2. Lead → Pipeline de Venta → Calificar
3. Pipeline → Convertir a Cliente
4. Cliente → Asignar Dieta + Entrenamiento
5. Cliente → Programar Cita Inicial
6. Agenda → Cita completada → Check-in
7. Check-ins → Adherencia → Seguimiento continuo
Cada paso → Links bidireccionales para navegar entre etapas
```

---

## 9. Flujos Avanzados y Complejos

### 9.1 Clientes ↔ Portal del Cliente

**Interconexión Principal:**
- **Desde Clientes → Portal:** Ver vista del cliente desde el lado del administrador
- **Desde Portal → Clientes:** Acciones del cliente que actualizan su perfil

**Casos de Uso:**
- Cliente actualiza sus restricciones alimentarias → Sincronizar con perfil
- Cliente completa check-in → Aparece en vista de check-ins
- Cliente reserva cita → Aparece en agenda
- Cliente ve su progreso → Datos desde adherencia y check-ins

**Implementación sugerida:**
```
Clientes → [Perfil cliente] → [Botón "Ver como cliente"] → Portal del Cliente (vista admin)
Portal → [Acciones cliente] → [Webhook/API] → Actualizar perfil en sistema admin
```

---

### 9.2 Objetivos & Rendimiento ↔ Múltiples Secciones

**Interconexión Principal:**
- Los objetivos se relacionan con clientes, entrenadores, ventas, y métricas generales

**Casos de Uso:**
- Ver progreso hacia objetivo de clientes nuevos
- Ver objetivo de ventas vs facturación real
- Ver objetivo de adherencia vs adherencia real
- Ver objetivos de equipo vs rendimiento individual

**Implementación sugerida:**
```
Objetivos → [Vista objetivo] → [Tab "Progreso"] → Enlaces a métricas relacionadas
  - Objetivo Clientes → Link a Clientes Activos
  - Objetivo Ventas → Link a Panel Financiero
  - Objetivo Adherencia → Link a Adherencia
  - Objetivo Equipo → Link a Evaluaciones Rendimiento
```

---

### 9.3 Encuestas & Satisfacción ↔ Clientes

**Interconexión Principal:**
- Las encuestas se asignan a clientes y los resultados se reflejan en su perfil

**Casos de Uso:**
- Enviar encuesta NPS desde perfil del cliente
- Ver respuestas de encuesta en perfil del cliente
- Segmentar clientes por satisfacción
- Crear campañas para clientes insatisfechos

**Implementación sugerida:**
```
Clientes → [Perfil cliente] → [Tab "Encuestas"] → Ver/Enviar encuestas
Encuestas → [Vista encuesta] → [Tab "Respuestas"] → Lista de clientes y sus respuestas
Encuestas → [Filtro satisfacción baja] → [Acción "Crear campaña"] → Campañas de retención
```

---

### 9.4 Lista de Espera ↔ Agenda

**Interconexión Principal:**
- Cuando hay cancelación, notificar a lista de espera y crear cita automática

**Casos de Uso:**
- Cliente cancela cita → Notificar siguiente en lista de espera
- Agregar cliente a lista de espera desde agenda
- Ver lista de espera por tipo de servicio
- Gestionar múltiples listas de espera por entrenador/servicio

**Implementación sugerida:**
```
Agenda → [Cita cancelada] → [Botón "Notificar lista espera"] → Lista de Espera
Lista de Espera → [Cliente seleccionado] → [Botón "Crear cita"] → Agenda
Agenda → [Crear cita] → [Servicio completo] → [Opción "Agregar a lista espera"]
```

---

### 9.5 Renovaciones & Bajas ↔ Clientes ↔ Membresías

**Interconexión Principal:**
- Flujo completo de gestión de ciclo de vida de membresía

**Casos de Uso:**
- Ver membresías próximas a vencer → Crear campaña de renovación
- Cliente no renueva → Mover a clientes perdidos
- Analizar razones de baja
- Automatizar proceso de baja

**Implementación sugerida:**
```
Renovaciones → [Membresía próxima vencer] → [Link a cliente] → Clientes → [Campaña renovación]
Renovaciones → [Membresía vencida] → [No renovada] → [Botón "Dar de baja"] → Clientes Perdidos
Clientes Perdidos → [Vista cliente] → [Razón baja] → [Analytics] → Dashboard
```

---

### 9.6 Plantillas de Mensajes ↔ Múltiples Secciones

**Interconexión Principal:**
- Plantillas usadas en campañas, facturación, seguimiento, etc.

**Casos de Uso:**
- Usar plantilla en campaña de email
- Usar plantilla en mensaje SMS a cliente
- Usar plantilla en factura/recibo
- Personalizar plantilla según segmento

**Implementación sugerida:**
```
Plantillas → [Vista plantilla] → [Tab "Usado en"] → Lista de campañas/mensajes
Campañas → [Crear campaña] → [Selector plantilla] → Seleccionar plantilla
Email Marketing → [Nuevo email] → [Usar plantilla] → Personalizar variables
```

---

### 9.7 Equipo & Roles ↔ Múltiples Secciones

**Interconexión Principal:**
- Los roles del equipo afectan permisos y visibilidad en todas las secciones

**Casos de Uso:**
- Ver entrenadores activos → Ver sus clientes
- Ver vendedores → Ver sus leads/pipeline
- Asignar permisos por sección
- Ver productividad por miembro del equipo

**Implementación sugerida:**
```
Equipo → [Vista entrenador] → [Tab "Clientes"] → Lista de clientes asignados
Equipo → [Vista vendedor] → [Tab "Pipeline"] → Leads y oportunidades
Roles → [Vista rol] → [Permisos] → Control acceso por sección
```

---

### 9.8 Objetivos & Comisiones ↔ Facturación ↔ Equipo

**Interconexión Principal:**
- Las comisiones se calculan desde facturación y objetivos

**Casos de Uso:**
- Ver objetivos de ventas del mes
- Calcular comisiones basadas en facturación
- Ver ranking de vendedores
- Generar reportes de comisiones

**Implementación sugerida:**
```
Objetivos Comisiones → [Vista objetivo] → [Tab "Progreso"] → Facturación relacionada
Facturación → [Factura creada] → [Calcular comisión] → Objetivos Comisiones
Equipo → [Vista vendedor] → [Tab "Comisiones"] → Historial y pendientes
```

---

### 9.9 Parte Horaria / Fichajes ↔ Agenda ↔ Equipo

**Interconexión Principal:**
- Los fichajes se relacionan con citas y horarios del staff

**Casos de Uso:**
- Verificar horas trabajadas vs citas asignadas
- Calcular horas extras
- Ver productividad por entrenador
- Gestionar ausencias y sustituciones

**Implementación sugerida:**
```
Fichajes → [Vista entrenador] → [Tab "Citas del día"] → Agenda relacionada
Agenda → [Cita asignada] → [Verificar fichaje] → Parte Horaria
Equipo → [Vista entrenador] → [Tab "Asistencia"] → Historial de fichajes
```

---

### 9.10 Nóminas ↔ Parte Horaria ↔ Objetivos & Comisiones

**Interconexión Principal:**
- Las nóminas se generan desde fichajes y comisiones

**Casos de Uso:**
- Calcular nómina mensual desde fichajes
- Agregar comisiones a nómina
- Ver desglose de nómina
- Exportar para contabilidad

**Implementación sugerida:**
```
Nóminas → [Generar nómina] → [Seleccionar mes] → [Calcular desde fichajes] → Parte Horaria
Nóminas → [Vista nómina] → [Tab "Comisiones"] → Objetivos Comisiones
Equipo → [Vista empleado] → [Tab "Nóminas"] → Historial completo
```

---

## 10. Flujos de Marketing Avanzado

### 10.1 Progressive Profiling ↔ Leads ↔ Segmentación

**Interconexión Principal:**
- El progressive profiling enriquece los datos del lead y mejora la segmentación

**Casos de Uso:**
- Lead completa formulario básico → Progressive profiling solicita más datos
- Actualizar segmento del lead según datos recolectados
- Personalizar mensajes según nivel de perfil
- Optimizar tasa de conversión

**Implementación sugerida:**
```
Lead Magnet → [Formulario básico] → Leads → [Progressive Profiling] → Más campos
Progressive Profiling → [Datos actualizados] → Segmentación → [Actualizar segmento]
Leads → [Vista lead] → [Nivel de perfil] → [Campañas personalizadas]
```

---

### 10.2 Gestión de Contenidos Premium ↔ Lead Magnets ↔ Clientes

**Interconexión Principal:**
- Contenido premium como lead magnet y recompensa para clientes

**Casos de Uso:**
- Crear lead magnet desde contenido premium
- Cliente activo accede a contenido premium
- Segmentar por contenido descargado
- Analizar conversión de contenido

**Implementación sugerida:**
```
Contenido Premium → [Crear] → [Usar como Lead Magnet] → Lead Magnets
Lead Magnets → [Cliente descarga] → Leads → [Convertir] → Clientes
Clientes → [Membresía activa] → [Acceso contenido premium] → Contenido Premium
```

---

### 10.3 Review & Testimonial Engine ↔ Clientes ↔ Marketing

**Interconexión Principal:**
- Generar reviews y testimonios de clientes para marketing

**Casos de Uso:**
- Cliente completa programa → Solicitar review
- Usar testimonial en landing page
- Segmentar clientes por satisfacción (NPS)
- Crear campaña de referidos desde reviews positivos

**Implementación sugerida:**
```
Clientes → [Programa completado] → [Solicitar review] → Review Engine
Review Engine → [Review positivo] → [Usar en Landing Page] → Landing Pages
Review Engine → [Segmentar satisfechos] → [Crear campaña referidos] → Campañas
```

---

### 10.4 SMS/WhatsApp Marketing ↔ Clientes ↔ Campañas

**Interconexión Principal:**
- Campañas de mensajería integradas con segmentación de clientes

**Casos de Uso:**
- Enviar recordatorio de cita por WhatsApp
- Campaña de re-engagement por SMS
- Notificar promoción a segmento específico
- Automatizar mensajes según acciones del cliente

**Implementación sugerida:**
```
Campañas → [Crear SMS/WhatsApp] → [Seleccionar segmento] → Segmentación
Clientes → [Acción disparadora] → [Automation] → SMS/WhatsApp Automation
Agenda → [Cita próxima] → [Automation] → SMS/WhatsApp Marketing (recordatorio)
```

---

### 10.5 Retargeting Pixel Manager ↔ Landing Pages ↔ Leads

**Interconexión Principal:**
- Pixels de retargeting para seguir leads y crear audiencias

**Casos de Uso:**
- Lead visita landing page → Pixel trackea → Crear audiencia
- Audiencia de retargeting → Campaña personalizada
- Medir efectividad de landing pages
- Optimizar conversión de embudos

**Implementación sugerida:**
```
Landing Pages → [Lead visita] → [Pixel dispara] → Retargeting Pixel Manager
Retargeting → [Crear audiencia] → [Campaña retargeting] → Campañas
Leads → [No convierte] → [Agregar a retargeting] → Retargeting Pixel Manager
```

---

### 10.6 Personalization Engine (IA) ↔ Múltiples Secciones

**Interconexión Principal:**
- IA personaliza experiencia en todas las secciones del sistema

**Casos de Uso:**
- Personalizar contenido según comportamiento del cliente
- Recomendar programas basados en historial
- Sugerir dietas según preferencias y restricciones
- Optimizar campañas automáticamente

**Implementación sugerida:**
```
Personalization Engine → [Analizar cliente] → [Recomendaciones] → Múltiples secciones
  - Recomendación programa → Programas
  - Recomendación dieta → Dietas
  - Personalización email → Email Marketing
  - Sugerir contenido → Contenido Premium
```

---

## 11. Flujos de Integraciones y Automatización

### 11.1 Integraciones ↔ Webhooks ↔ Múltiples Secciones

**Interconexión Principal:**
- Integraciones externas actualizan datos en tiempo real

**Casos de Uso:**
- Cliente reserva desde app móvil → Webhook actualiza Agenda
- Pago procesado → Webhook actualiza Facturación
- Lead de Facebook Ads → Webhook crea Lead en sistema
- Sincronización con CRM externo

**Implementación sugerida:**
```
Integraciones → [Configurar webhook] → [Evento dispara] → Sección relacionada
Webhooks → [Configurar] → [API Keys] → [Documentación] → Integraciones
App Externa → [Acción] → [Webhook] → Sistema interno actualiza
```

---

### 11.2 Importadores / Migraciones ↔ Múltiples Secciones

**Interconexión Principal:**
- Importar datos masivos desde sistemas anteriores

**Casos de Uso:**
- Migrar clientes desde Excel
- Importar historial de facturación
- Migrar productos e inventario
- Importar programas de entrenamiento

**Implementación sugerida:**
```
Importadores → [Seleccionar sección] → [Subir archivo] → [Mapear campos] → Importar
  - Clientes → Importar → Actualizar Clientes
  - Productos → Importar → Actualizar Inventario
  - Facturas → Importar → Actualizar Facturación
```

---

### 11.3 Automatizaciones ↔ Lifecycle Email Sequences

**Interconexión Principal:**
- Secuencias automáticas basadas en acciones del cliente

**Casos de Uso:**
- Cliente nuevo → Secuencia de bienvenida
- Cliente inactivo → Secuencia de re-engagement
- Membresía próxima a vencer → Secuencia de renovación
- Programa completado → Secuencia de seguimiento

**Implementación sugerida:**
```
Lifecycle Sequences → [Crear secuencia] → [Disparadores] → [Emails automáticos]
Clientes → [Acción disparadora] → [Automation] → Lifecycle Sequences
  - Cliente nuevo → Secuencia bienvenida
  - Sin actividad 30 días → Secuencia re-engagement
  - Membresía vence en 7 días → Secuencia renovación
```

---

## 12. Flujos de Análisis y Reportes

### 12.1 Trend Analyzer ↔ Múltiples Secciones

**Interconexión Principal:**
- Analizar tendencias en todas las áreas del negocio

**Casos de Uso:**
- Tendencias de adquisición de clientes
- Tendencias de programas más populares
- Tendencias de ingresos por período
- Tendencias de adherencia y retención

**Implementación sugerida:**
```
Trend Analyzer → [Seleccionar métrica] → [Análisis] → Enlaces a secciones relacionadas
  - Tendencia clientes → Link a Clientes
  - Tendencia programas → Link a Programas
  - Tendencia ingresos → Link a Panel Financiero
  - Tendencia adherencia → Link a Adherencia
```

---

### 12.2 Analítica de Adquisición ↔ Múltiples Canales

**Interconexión Principal:**
- Analizar efectividad de todos los canales de marketing

**Casos de Uso:**
- ROI por canal de marketing
- Coste por lead por canal
- Conversión por fuente
- Optimizar presupuesto de marketing

**Implementación sugerida:**
```
Analítica Adquisición → [Gráfico canal] → [Click] → Leads del canal
Analítica Adquisición → [Comparar canales] → [Optimizar] → Campañas
Lead Magnets → [Métricas] → [Contribución] → Analítica Adquisición
Landing Pages → [Métricas] → [Contribución] → Analítica Adquisición
```

---

### 12.3 Informes Financieros Avanzados ↔ Múltiples Secciones

**Interconexión Principal:**
- Reportes financieros que agregan datos de múltiples fuentes

**Casos de Uso:**
- Ingresos por tipo de servicio
- Gastos por categoría
- ROI de marketing
- Análisis de rentabilidad por cliente

**Implementación sugerida:**
```
Informes Financieros → [Crear reporte] → [Seleccionar fuentes] → Agregar datos
  - Facturación → Ingresos
  - Gastos → Egresos
  - Campañas → Costos marketing
  - Clientes → LTV (Lifetime Value)
```

---

## 13. Flujos de B2B y Corporativos

### 13.1 Empresas / Convenios ↔ Empleados Activos ↔ Facturación

**Interconexión Principal:**
- Gestión completa del ciclo B2B

**Casos de Uso:**
- Crear convenio con empresa
- Gestionar empleados activos de la empresa
- Facturar a empresa según uso
- Generar reportes corporativos

**Implementación sugerida:**
```
Empresas Convenios → [Crear empresa] → [Agregar empleados] → Empleados Activos
Empleados Activos → [Usos registrados] → [Uso & Resultados] → Facturación Empresas
Empresas Convenios → [Vista empresa] → [Tab "Facturación"] → Historial facturas
```

---

### 13.2 Portal Empresa ↔ Empresas ↔ Empleados

**Interconexión Principal:**
- Portal para que empresas gestionen sus empleados

**Casos de Uso:**
- Empresa ve uso de sus empleados
- Empresa gestiona acceso de empleados
- Empresa ve facturación
- Empresa descarga reportes

**Implementación sugerida:**
```
Portal Empresa → [Login empresa] → [Dashboard] → Múltiples vistas
  - Empleados activos → Ver lista y estadísticas
  - Facturación → Ver facturas y pagos
  - Reportes → Descargar uso y resultados
Empresas Convenios → [Vista empresa] → [Link "Portal"] → Portal Empresa
```

---

## 14. Flujos de Multisede

### 14.1 Resumen por Sede ↔ Múltiples Secciones

**Interconexión Principal:**
- Vista consolidada de todas las métricas por sede

**Casos de Uso:**
- Comparar performance entre sedes
- Ver clientes por sede
- Ver ingresos por sede
- Gestionar transferencias

**Implementación sugerida:**
```
Resumen por Sede → [Seleccionar sede] → [Métricas] → Enlaces detallados
  - Clientes → Lista clientes de la sede
  - Ingresos → Facturación de la sede
  - Eventos → Eventos de la sede
  - Equipo → Staff de la sede
```

---

### 14.2 Comparativa Entre Sedes ↔ Dashboard

**Interconexión Principal:**
- Comparar métricas clave entre todas las sedes

**Casos de Uso:**
- Ranking de sedes por ingresos
- Comparar adherencia entre sedes
- Ver qué sede tiene mejor retención
- Identificar mejores prácticas

**Implementación sugerida:**
```
Comparativa Sedes → [Gráficos comparativos] → [Click en sede] → Resumen por Sede
Dashboard → [Widget "Sedes"] → [Click] → Comparativa Entre Sedes
```

---

### 14.3 Transferencias Entre Sedes ↔ Clientes ↔ Membresías

**Interconexión Principal:**
- Gestionar transferencia de clientes entre sedes

**Casos de Uso:**
- Cliente se muda → Transferir a otra sede
- Verificar disponibilidad de membresía en otra sede
- Mantener historial del cliente
- Notificar cambios

**Implementación sugerida:**
```
Clientes → [Perfil cliente] → [Botón "Transferir"] → Transferencias Entre Sedes
Transferencias → [Seleccionar sede destino] → [Verificar membresía] → Membresías
Transferencias → [Confirmar] → [Actualizar cliente] → Clientes (sede actualizada)
```

---

## 15. Flujos de Configuración y Settings

### 15.1 Servicios & Tarifas ↔ Catálogo de Planes ↔ Membresías

**Interconexión Principal:**
- Configurar servicios y tarifas que se usan en planes y membresías

**Casos de Uso:**
- Crear nuevo servicio → Usar en plan
- Actualizar tarifa → Actualizar planes afectados
- Ver qué planes usan un servicio
- Gestionar precios por sede

**Implementación sugerida:**
```
Servicios Tarifas → [Crear servicio] → [Usar en plan] → Catálogo de Planes
Catálogo Planes → [Vista plan] → [Servicios incluidos] → Servicios Tarifas
Servicios Tarifas → [Actualizar precio] → [Notificar planes] → Catálogo Planes
```

---

### 15.2 Políticas & Términos ↔ Múltiples Secciones

**Interconexión Principal:**
- Políticas aplicadas en contratos, membresías, y términos de servicio

**Casos de Uso:**
- Cliente acepta términos al registrarse
- Mostrar políticas en portal del cliente
- Actualizar políticas → Notificar clientes afectados
- Gestionar versiones de políticas

**Implementación sugerida:**
```
Políticas Términos → [Crear política] → [Versionar] → [Aplicar] → Múltiples lugares
  - Registro cliente → Mostrar términos
  - Portal cliente → Sección políticas
  - Membresías → Términos de membresía
  - Contratos → Incluir políticas
```

---

### 15.3 Configuración Financiera ↔ Facturación ↔ Impuestos

**Interconexión Principal:**
- Configuración que afecta toda la facturación

**Casos de Uso:**
- Configurar moneda → Aplicar a todas las facturas
- Configurar impuestos → Calcular automáticamente
- Configurar series de factura → Numeración automática
- Exportar para contabilidad

**Implementación sugerida:**
```
Configuración Financiera → [Moneda] → [Impuestos] → [Series] → [Guardar]
Facturación → [Crear factura] → [Usar configuración] → Generar factura
Impuestos Export → [Exportar] → [Formato contable] → Archivo exportado
```

---

## 16. Flujos de Notificaciones y Alertas

### 16.1 Tareas & Alertas ↔ Múltiples Secciones

**Interconexión Principal:**
- Sistema de alertas que se disparan desde múltiples fuentes

**Casos de Uso:**
- Cliente en riesgo → Alerta → Link a perfil
- Stock bajo → Alerta → Link a inventario
- Pago pendiente → Alerta → Link a factura
- Check-in pendiente → Alerta → Link a check-in

**Implementación sugerida:**
```
Múltiples Secciones → [Condición disparadora] → [Crear alerta] → Tareas & Alertas
Tareas & Alertas → [Vista alerta] → [Link contextual] → Sección relacionada
  - Alerta cliente → Link a Clientes
  - Alerta stock → Link a Inventario
  - Alerta pago → Link a Facturación
  - Alerta check-in → Link a Check-ins
```

---

### 16.2 Bell / Notificaciones ↔ Dashboard

**Interconexión Principal:**
- Notificaciones en tiempo real en el dashboard

**Casos de Uso:**
- Nueva tarea asignada
- Nuevo lead recibido
- Pago recibido
- Mensaje nuevo en inbox

**Implementación sugerida:**
```
Dashboard → [Bell icon] → [Lista notificaciones] → [Click] → Sección relacionada
Múltiples Secciones → [Evento] → [Notificación] → Dashboard (bell actualiza)
```

---

## 17. Flujos de Búsqueda y Navegación

### 17.1 Búsqueda Global ↔ Todas las Secciones

**Interconexión Principal:**
- Búsqueda unificada que indexa todas las secciones

**Casos de Uso:**
- Buscar cliente por nombre
- Buscar producto por código
- Buscar factura por número
- Buscar evento por nombre

**Implementación sugerida:**
```
Búsqueda Global → [Query] → [Resultados categorizados] → Enlaces directos
  - Resultados Clientes → Link a perfil cliente
  - Resultados Productos → Link a catálogo
  - Resultados Facturas → Link a facturación
  - Resultados Eventos → Link a eventos
```

---

### 17.2 Breadcrumbs ↔ Navegación Contextual

**Interconexión Principal:**
- Ruta de navegación que muestra jerarquía y permite retroceder

**Casos de Uso:**
- Ver de dónde vienes
- Navegar hacia atrás rápidamente
- Entender contexto actual
- Compartir URL específica

**Implementación sugerida:**
```
Navegación → [Breadcrumbs] → [Click en nivel] → Navegar a ese nivel
Ejemplo: Dashboard > Clientes > Juan Pérez > Dietas > Dieta Keto
```

---

## 18. Flujos de Reportes y Exportación

### 18.1 Múltiples Secciones ↔ Exportación

**Interconexión Principal:**
- Exportar datos de cualquier sección en múltiples formatos

**Casos de Uso:**
- Exportar lista de clientes a Excel
- Exportar facturas a PDF
- Exportar reportes financieros
- Exportar datos para análisis externo

**Implementación sugerida:**
```
Cualquier Sección → [Botón "Exportar"] → [Seleccionar formato] → [Descargar]
  - Excel → Datos tabulares
  - PDF → Reportes formateados
  - CSV → Para análisis
  - JSON → Para integraciones
```

---

## 19. Flujos Condicionales y Automáticos

### 19.1 Reglas de Negocio Automáticas

**Flujo: Cliente Nuevo Automático**
```
Lead → [Convertido] → [Regla automática] → 
  → Crear cliente
  → Asignar membresía inicial
  → Enviar email de bienvenida
  → Crear tarea de seguimiento
  → Agregar a secuencia de onboarding
```

**Flujo: Stock Bajo Automático**
```
Inventario → [Stock < mínimo] → [Regla automática] →
  → Crear alerta
  → Crear orden de compra sugerida
  → Notificar encargado de compras
  → Calcular fecha de agotamiento
```

**Flujo: Pago Pendiente Automático**
```
Facturación → [Vencimiento próximo] → [Regla automática] →
  → Enviar recordatorio
  → Crear alerta
  → Actualizar estado de pago
  → Si vencido → Mover a morosidad
```

**Flujo: Adherencia Baja Automática**
```
Adherencia → [Cumplimiento < umbral] → [Regla automática] →
  → Crear alerta
  → Agregar cliente a segmento "Riesgo"
  → Enviar campaña de re-engagement
  → Crear tarea de seguimiento
```

---

## 20. Flujos de Analytics y Dashboards

### 20.1 Dashboard Interactivo ↔ Múltiples Secciones

**Widgets del Dashboard:**
- **Métricas Clientes** → Click → Clientes Activos
- **Métricas Finanzas** → Click → Panel Financiero
- **Próximas Citas** → Click → Agenda (filtrado por fecha)
- **Leads Nuevos** → Click → Inbox Unificado
- **Stock Bajo** → Click → Inventario (filtrado por stock bajo)
- **Pagos Pendientes** → Click → Pagos Pendientes
- **Adherencia** → Click → Adherencia (vista general)
- **Eventos Próximos** → Click → Eventos (filtrado por fecha)

**Implementación sugerida:**
```
Dashboard → [Widget clickeable] → [Navegación] → Sección relacionada (filtrada)
Dashboard → [Filtro de fecha] → [Actualizar widgets] → Datos filtrados
```

---

### 20.2 Reportes Personalizados ↔ Múltiples Fuentes

**Interconexión Principal:**
- Crear reportes combinando datos de múltiples secciones

**Casos de Uso:**
- Reporte de cliente completo (dietas + programas + facturación)
- Reporte de rentabilidad por programa
- Reporte de efectividad de marketing
- Reporte ejecutivo consolidado

**Implementación sugerida:**
```
Reportes → [Crear reporte personalizado] → [Seleccionar fuentes] → 
  → Agregar datos de múltiples secciones
  → Configurar filtros
  → Personalizar visualización
  → Guardar como plantilla
```

---

## 📈 Resumen Ejecutivo de Interconexiones

### Total de Interconexiones Documentadas: **150+**

### Categorías:
- **Flujos Centrados en Clientes:** 15+
- **Flujos de Entrenamiento y Nutrición:** 10+
- **Flujos de Ventas y Finanzas:** 15+
- **Flujos de Marketing:** 20+
- **Flujos Operativos:** 10+
- **Flujos de Agenda y Eventos:** 8+
- **Flujos de Análisis:** 10+
- **Flujos Avanzados:** 25+
- **Flujos de Configuración:** 10+
- **Flujos Transversales:** 15+

---

*Este documento es una guía completa para implementar interconexiones entre páginas. Cada interconexión debe ser diseñada considerando la experiencia de usuario, la lógica de negocio específica, y las mejores prácticas de UX/UI.*

---
