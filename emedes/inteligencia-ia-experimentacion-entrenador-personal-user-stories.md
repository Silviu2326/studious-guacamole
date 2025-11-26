## US-01: Ver un resumen claro de qué hace esta sección al entrar
**Como** Entrenador personal  
**Quiero** ver una explicación clara y simple de qué puedo hacer en esta sección al entrar  
**Para** entender rápidamente si esta sección me ayuda a resolver mis necesidades de marketing y crecimiento  
**Descripción**: Reemplazar el texto técnico actual por una descripción clara que explique que aquí puedo crear campañas de marketing automatizadas, probar qué mensajes funcionan mejor con mis clientes, y obtener recomendaciones inteligentes para hacer crecer mi negocio.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-02: Ver métricas clave de mis campañas y experimentos en el header
**Como** Entrenador personal  
**Quiero** ver un resumen rápido de métricas importantes como campañas activas, leads generados esta semana, y experimentos en curso  
**Para** tener una visión rápida del estado de mi marketing sin tener que navegar por las pestañas  
**Descripción**: Agregar un panel de métricas resumidas en el header mostrando: número de campañas activas, leads generados en últimos 7 días, experimentos en ejecución, y próxima acción recomendada. Diseño compacto y visual.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-03: Botón con nombre claro para crear campaña de marketing
**Como** Entrenador personal  
**Quiero** ver un botón que diga "Crear Campaña de Marketing" en lugar de "Nuevo Playbook IA"  
**Para** entender inmediatamente qué voy a hacer al hacer clic, sin tener que adivinar qué es un "playbook"  
**Descripción**: Cambiar el texto del botón a algo más claro como "Crear Campaña" o "Nueva Campaña de Marketing", con un tooltip o descripción corta que explique que puedo crear campañas automatizadas de email, WhatsApp, redes sociales, etc.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-04: Botón para probar diferentes mensajes y estrategias con nombre claro
**Como** Entrenador personal  
**Quiero** ver un botón que diga "Probar Estrategia" o "Test A/B" en lugar de "Lanzar Experimento"  
**Para** entender que puedo probar diferentes mensajes o enfoques para ver cuál funciona mejor con mis clientes  
**Descripción**: Cambiar el texto a algo más comprensible como "Probar Mensajes" o "Test de Estrategias", con explicación de que puedo enviar dos versiones diferentes y ver cuál genera más respuestas o conversiones.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-05: Ver recomendaciones personalizadas basadas en mi negocio
**Como** Entrenador personal  
**Quiero** ver recomendaciones específicas como "Tienes 5 clientes inactivos, crea una campaña de reactivación" o "Tu mejor momento para publicar es los martes a las 7am"  
**Para** saber qué acciones tomar ahora mismo para mejorar mi negocio  
**Descripción**: Agregar una sección de recomendaciones inteligentes en el header que analice mis datos (clientes inactivos, mejor momento de publicación, objetivos no alcanzados) y sugiera acciones concretas con botones de acción rápida.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-06: Acceso rápido a mis campañas más exitosas
**Como** Entrenador personal  
**Quiero** ver un enlace rápido a mis campañas que más leads o clientes han generado  
**Para** poder duplicarlas o crear variaciones rápidamente sin tener que buscar en la lista completa  
**Descripción**: Agregar un dropdown o sección en el header con "Mis Top 3 Campañas" mostrando las campañas más exitosas con métricas clave (leads generados, conversiones) y botón para duplicar o ver detalles.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-07: Ver estado de mis experimentos activos de un vistazo
**Como** Entrenador personal  
**Quiero** ver cuántos experimentos tengo corriendo y cuáles están listos para revisar resultados  
**Para** no olvidarme de revisar qué estrategias funcionaron mejor y aplicar los ganadores  
**Descripción**: Agregar un indicador visual en el header mostrando número de experimentos activos, experimentos completados pendientes de revisión, y acceso rápido a ver resultados. Badge con notificación si hay resultados listos.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-08: Explicación visual de qué es un playbook para entrenadores
**Como** Entrenador personal  
**Quiero** ver una explicación simple con ejemplos de qué es un playbook o campaña de marketing  
**Para** entender que es una secuencia automatizada de mensajes (emails, WhatsApp, posts) que ayuda a conseguir objetivos como captar clientes o reactivar inactivos  
**Descripción**: Agregar un tooltip o modal informativo accesible desde el header que explique con ejemplos concretos: "Un playbook es como una campaña de marketing completa. Por ejemplo, 'Reactivar Clientes Inactivos' envía automáticamente 3 mensajes durante una semana para que vuelvan a entrenar contigo."  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-09: Acceso rápido a plantillas de campañas comunes para entrenadores
**Como** Entrenador personal  
**Quiero** ver un botón o enlace a plantillas predefinidas de campañas como "Captar Clientes Año Nuevo", "Reactivar Inactivos", "Programa de Referidos"  
**Para** poder crear campañas rápidamente usando plantillas probadas en lugar de empezar desde cero  
**Descripción**: Agregar un botón "Ver Plantillas" o dropdown en el header que muestre las plantillas más populares para entrenadores con descripción breve y acceso directo a activarlas.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-10: Ver próximas acciones programadas relacionadas con esta sección
**Como** Entrenador personal  
**Quiero** ver qué campañas se van a enviar hoy o esta semana desde esta sección  
**Para** tener control sobre qué mensajes van a recibir mis clientes y poder ajustar si es necesario  
**Descripción**: Agregar una sección "Próximos Envíos" en el header mostrando las próximas 3-5 acciones programadas (emails, mensajes, posts) con fecha/hora y opción de pausar o editar rápidamente.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-11: Cambiar el badge "Engagement Hub" por algo más claro
**Como** Entrenador personal  
**Quiero** ver un badge o etiqueta que diga algo como "Centro de Marketing" o "Marketing Inteligente" en lugar de "Engagement Hub"  
**Para** entender inmediatamente que esta sección es sobre marketing y crecimiento, no sobre términos técnicos  
**Descripción**: Cambiar el badge actual por algo más comprensible y orientado al entrenador, como "Marketing Inteligente" o "Crecimiento Automatizado", manteniendo el diseño visual pero con texto más claro.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-12: Ver alertas de campañas que necesitan atención
**Como** Entrenador personal  
**Quiero** ver notificaciones visuales si tengo campañas pausadas, errores en envíos, o experimentos que terminaron y necesitan revisión  
**Para** no perder oportunidades o dejar problemas sin resolver  
**Descripción**: Agregar un sistema de alertas en el header con iconos de notificación mostrando: campañas pausadas que podrían reactivarse, errores de envío que requieren acción, experimentos completados con resultados listos. Badge con contador y acceso rápido.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-13: Acceso rápido a crear campaña desde un objetivo específico
**Como** Entrenador personal  
**Quiero** ver botones de acción rápida para objetivos comunes como "Captar Nuevos Clientes", "Reactivar Inactivos", "Aumentar Retención"  
**Para** crear campañas directamente enfocadas en lo que necesito ahora, sin tener que navegar por múltiples pasos  
**Descripción**: Agregar botones de acción rápida en el header con los objetivos más comunes para entrenadores. Al hacer clic, se abre un asistente guiado para crear esa campaña específica con plantillas y sugerencias pre-cargadas.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-14: Ver comparativa de rendimiento de mis estrategias
**Como** Entrenador personal  
**Quiero** ver un resumen visual de qué tipos de campañas o mensajes están funcionando mejor (ej: emails de reactivación vs posts en redes sociales)  
**Para** enfocar mi tiempo y esfuerzo en las estrategias que más resultados me dan  
**Descripción**: Agregar un gráfico pequeño o métricas comparativas en el header mostrando qué canales (email, WhatsApp, redes) y qué tipos de campañas generan más leads/conversiones, con acceso a ver detalles completos.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-15: Ver tutorial o guía rápida la primera vez que entro
**Como** Entrenador personal  
**Quiero** ver una guía rápida o tutorial la primera vez que entro a esta sección  
**Para** entender cómo usar todas las funcionalidades sin tener que explorar por prueba y error  
**Descripción**: Implementar un tour guiado o modal de bienvenida que explique las 3-4 funciones principales: crear campañas, probar estrategias, ver resultados, y usar plantillas. Accesible desde un botón "¿Cómo funciona?" en el header.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-16: Ver objetivos de marketing conectados con mis metas de negocio
**Como** Entrenador personal  
**Quiero** ver mis objetivos de marketing del mes (ej: "Captar 10 nuevos clientes") y el progreso hacia ellos  
**Para** saber si estoy en camino de alcanzar mis metas y qué acciones tomar si no  
**Descripción**: Agregar una sección de objetivos en el header mostrando metas como "Nuevos clientes este mes", "Clientes reactivados", "Leads generados" con barra de progreso y porcentaje completado. Integrado con datos reales de campañas y clientes.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-17: Búsqueda rápida de campañas y experimentos desde el header
**Como** Entrenador personal  
**Quiero** tener un campo de búsqueda en el header para encontrar rápidamente una campaña o experimento específico  
**Para** no tener que buscar en listas largas cuando sé el nombre de lo que busco  
**Descripción**: Agregar un campo de búsqueda en el header que permita buscar por nombre de campaña, experimento, o palabras clave, con resultados en tiempo real y acceso directo al elemento encontrado.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-18: Ver resumen de ROI de mis campañas de marketing
**Como** Entrenador personal  
**Quiero** ver un resumen de cuánto dinero he ganado o cuántos clientes he conseguido gracias a mis campañas de marketing  
**Para** entender el valor real de invertir tiempo en marketing y justificar continuar usando estas herramientas  
**Descripción**: Agregar una métrica destacada en el header mostrando ROI estimado o clientes generados por campañas en el último mes, con comparativa con el mes anterior. Cálculo basado en leads convertidos y valor promedio de cliente.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

## US-19: Acceso rápido a ver qué están haciendo mis competidores (si aplica)
**Como** Entrenador personal  
**Quiero** ver insights sobre tendencias de marketing en el sector de entrenamiento personal  
**Para** estar al día con qué estrategias están usando otros entrenadores exitosos y poder aplicarlas  
**Descripción**: Agregar un enlace o sección en el header a "Tendencias del Sector" o "Qué funciona en Fitness" mostrando insights agregados y anónimos sobre estrategias exitosas, mejores momentos para publicar, tipos de contenido que generan más leads, etc.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader.tsx`

---

