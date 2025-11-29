## 3. USER STORIES

### 🧬 PERFIL ESTRATÉGICO DEL ENTRENADOR

**US-OM-01**: Como Entrenador personal, Quiero completar mi perfil estratégico (tono, especialidad, pilares de contenido, buyer persona) desde el dashboard, Para que todas las recomendaciones se adapten automáticamente a mi estilo.  
**Feature**: `src/features/OverviewMarketing`  
**Descripción**: Wizard inicial para capturar voz, servicios clave, propuesta de valor y formato favorito. Guardar en `TrainerProfileContext`. Botón de edición rápida en el header. Sincronizar con otros módulos.

**US-OM-02**: Como Entrenador personal, Quiero elegir mis objetivos trimestrales (captar leads, vender packs, fidelizar), Para que el dashboard priorice métricas y alertas relevantes.  
**Feature**: `src/features/OverviewMarketing`  
**Descripción**: Selector de objetivos con ponderaciones. KPIs destacados cambian según metas. IA recalcula sugerencias y muestra progreso esperado.

**US-OM-03**: Como Entrenador personal, Quiero definir mis fortalezas (HIIT, fuerza funcional, nutrición holística), Para que las campañas sugeridas reflejen lo que mejor sé hacer.  
**Feature**: `src/features/OverviewMarketing`  
**Descripción**: Etiquetas y notas libres. Impacta filtros de `AISuggestions`, módulos “Próxima acción” y copy recomendado.

### 📊 INSIGHTS Y MÉTRICAS ACCIONABLES

**US-OM-04**: Como Entrenador personal, Quiero ver KPIs priorizados con narrativa contextual (qué significa para mí), Para saber exactamente qué hacer después.  
**Feature**: `src/features/OverviewMarketing/components/KPICards`  
**Descripción**: Cada KPI incluye texto IA personalizado que conecta valor actual con objetivo. Botón “Ver acción” abre modal con pasos sugeridos.

**US-OM-05**: Como Entrenador personal, Quiero segmentar KPIs por buyer persona (ejecutivos, madres, atletas), Para detectar oportunidades específicas.  
**Feature**: `src/features/OverviewMarketing`  
**Descripción**: Toggle por segmento alimentado por `TrainerProfile`. KPIs, funnels y campañas se recalculan. Gráficos comparativos.

**US-OM-06**: Como Entrenador personal, Quiero que el panel me avise cuando algún indicador se salga del rango esperado, Para poder reaccionar rápido.  
**Feature**: `src/features/OverviewMarketing/services/marketingOverviewService`  
**Descripción**: Umbrales configurables. Alertas visuales + notificación en campanita. Sugerencias IA para corregir.

**US-OM-07**: Como Entrenador personal, Quiero ver cómo se relacionan mis campañas, lead magnets y contenido con las ventas reales, Para optimizar lo que funciona.  
**Feature**: `src/features/OverviewMarketing/components/TopFunnels`  
**Descripción**: Gráfico de atribución cruzando campañas, piezas de contenido y conversiones. IA resume insights clave.

### 🤖 SUGERENCIAS IA MULTICADENA

**US-OM-08**: Como Entrenador personal, Quiero recibir una estrategia IA semanal ya personalizada con mensajes, funnels y publicaciones, Para ejecutarla en minutos.  
**Feature**: `src/features/OverviewMarketing/components/AISuggestions`  
**Descripción**: Generador IA usa `TrainerProfile`, objetivos y datos reales. Entrega plan día a día con links para crear assets en otros módulos.

**US-OM-09**: Como Entrenador personal, Quiero que la IA adapte cada sugerencia al tono que seleccioné (cercano, técnico, motivador), Para mantener coherencia de marca.  
**Feature**: `src/features/OverviewMarketing/components/AISuggestions`  
**Descripción**: Prompt dinámico con tono, CTA preferido, formato. Vista previa editable antes de enviar a ejecución.

**US-OM-10**: Como Entrenador personal, Quiero guardar mis sugerencias favoritas como playbooks recurrentes, Para reutilizarlas en futuros periodos.  
**Feature**: `src/features/OverviewMarketing/components/AISuggestions`  
**Descripción**: Botón “Guardar como playbook”. Categorías, tags, histórico de resultados. Sincronizar con módulo de Inteligencia IA.

**US-OM-11**: Como Entrenador personal, Quiero que la IA me diga qué contenido repotenciar según rendimiento y estilo, Para amplificar ganadores sin reinventar la rueda.  
**Feature**: `src/features/OverviewMarketing/components/SocialGrowth`  
**Descripción**: Algoritmo detecta piezas con mejor engagement y propone reciclaje (reels, emails, retos). Botón para clonarlo en Content Studio.

### 🧭 FLUJOS DE ACCIÓN INTEGRADOS

**US-OM-12**: Como Entrenador personal, Quiero crear un funnel o campaña directamente desde el insight destacado, Para no saltar entre módulos.  
**Feature**: `src/features/OverviewMarketing/components/ActiveCampaigns`  
**Descripción**: Botón “Lanzar acción IA” abre modal con prompts prellenados y envía datos a `FunnelsAdquisicion` o `CampanasAutomatizacion`.

**US-OM-13**: Como Entrenador personal, Quiero iniciar conversaciones con leads calientes desde el dashboard, Para no perder oportunidades.  
**Feature**: `src/features/OverviewMarketing`  
**Descripción**: Tabla “Leads calientes” con CTA a WhatsApp/email. Mensajes IA listos usando tono del entrenador.

**US-OM-14**: Como Entrenador personal, Quiero compartir un resumen IA semanal con mi equipo (community manager, nutricionista), Para alinear acciones.  
**Feature**: `src/features/OverviewMarketing/components/MonthlyReportManager`  
**Descripción**: Reporte IA exportable con tareas sugeridas por rol. Programar envío automático.

### 📅 PLANIFICACIÓN Y PREVISIÓN

**US-OM-15**: Como Entrenador personal, Quiero forecast automatizado de leads e ingresos según mis campañas en curso, Para ajustar recursos y cupos.  
**Feature**: `src/features/OverviewMarketing`  
**Descripción**: Modelo predictivo con escenarios optimista/base/conservador. Ajustes manuales. CTA para cerrar cupos o lanzar promo.

**US-OM-16**: Como Entrenador personal, Quiero ver un roadmap IA de activaciones sugeridas (retos, colaboraciones, lives), Para mantener consistencia.  
**Feature**: `src/features/OverviewMarketing/components/UpcomingEvents`  
**Descripción**: Calendario con slots recomendados, conectado a disponibilidad y objetivos. Botón “Crear evento” abre Eventos & Retos con plantillas IA.

**US-OM-17**: Como Entrenador personal, Quiero recibir alertas cuando haya huecos críticos en mi calendario de marketing, Para rellenarlos con propuestas IA pertinentes.  
**Feature**: `src/features/OverviewMarketing`  
**Descripción**: Detección de semanas con poca actividad planificada. IA recomienda campañas y contenidos específicos.

### 🔄 APRENDIZAJE CONTINUO

**US-OM-18**: Como Entrenador personal, Quiero que el dashboard aprenda de mis acciones aceptadas/rechazadas, Para que la IA se vuelva más precisa.  
**Feature**: `src/features/OverviewMarketing/services/marketingOverviewService`  
**Descripción**: Sistema de feedback con botones “Me sirve / No es relevante”. Ajusta pesos en motores de recomendación y guarda notas.

**US-OM-19**: Como Entrenador personal, Quiero registrar experimentos realizados y su impacto en KPIs, Para saber qué repetir.  
**Feature**: `src/features/OverviewMarketing/components/AISuggestions`  
**Descripción**: Opción de marcar sugerencia como “Experimentación”. Integra con módulo de Inteligencia IA y guarda resultados.

**US-OM-20**: Como Entrenador personal, Quiero tips IA específicos cuando una métrica cae (ej: engagement bajo), Para saber qué ajuste es más efectivo según mi estilo.  
**Feature**: `src/features/OverviewMarketing/components/KPICards`  
**Descripción**: Tooltip IA contextual con recomendación paso a paso, ejemplos de copy, enlaces a plantillas y estimación de impacto.


