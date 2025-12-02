# Feedback Loop & Encuestas Inteligentes

**Página padre:** Hola

---

# Feedback Loop & Encuestas Inteligentes
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Principalmente para el 'Entrenador Personal (Administrador)' y 'Entrenador Asociado', quienes diseñan, configuran, envían y analizan las encuestas. El rol 'Cliente' interactúa con la funcionalidad al recibir y responder las encuestas a través de su portal o por email/SMS, pero no accede a la configuración ni a los dashboards de resultados.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/feedback/surveys
## Descripción Funcional
La página de 'Feedback Loop & Encuestas Inteligentes' es el centro de control para entender la experiencia del cliente en TrainerERP. Esta funcionalidad permite a los entrenadores personales ir más allá de las conversaciones casuales y recopilar datos estructurados sobre la satisfacción, progreso y lealtad de sus clientes. No se trata solo de enviar formularios genéricos; es un sistema diseñado para crear bucles de retroalimentación continuos y automatizados. Los entrenadores pueden crear encuestas desde cero o utilizar plantillas específicas para el nicho de fitness, como 'Satisfacción Post-Sesión', 'Check-in de Progreso Semanal', 'Net Promoter Score (NPS) Trimestral' o 'Feedback sobre un Nuevo Plan Nutricional'. La verdadera potencia reside en la automatización inteligente: una encuesta puede dispararse automáticamente 24 horas después de una sesión de entrenamiento, al cumplirse 30 días de un nuevo plan, o cuando un cliente marca un objetivo como completado. El sistema recopila todas las respuestas en un dashboard centralizado, traduciendo los datos brutos en insights accionables. Los entrenadores pueden ver métricas clave de un vistazo, identificar tendencias, detectar clientes en riesgo de abandono por feedback negativo y, lo más importante, actuar sobre esa información para mejorar su servicio, personalizar aún más la experiencia y fortalecer la relación con cada cliente, convirtiendo el feedback en una herramienta proactiva de retención y crecimiento.
## Valor de Negocio
El valor de negocio de esta funcionalidad es transformar la gestión de la relación con el cliente de reactiva a proactiva, impactando directamente en la retención y el marketing. Para un entrenador personal, cuyo negocio se basa en la confianza y los resultados, entender la percepción del cliente es vital. Este módulo convierte las opiniones subjetivas en métricas cuantificables (como NPS y CSAT), permitiendo al entrenador tomar decisiones basadas en datos para mejorar sus programas de entrenamiento y comunicación. Al automatizar la recopilación de feedback, se asegura un pulso constante sobre la salud de su clientela sin añadir carga administrativa. Identificar a un cliente insatisfecho a través de una alerta automática por una mala puntuación permite una intervención temprana, evitando el abandono y demostrando un nivel de atención excepcional. Además, las respuestas positivas y los testimonios recopilados se convierten en una fuente inagotable de 'social proof' para sus landing pages y redes sociales, alimentando el área de 'CAPTURA & CONVERSIÓN' con pruebas reales del valor que ofrece. En esencia, este módulo no solo mejora el servicio actual, sino que también genera los activos de marketing más auténticos y poderosos: las historias de éxito y la satisfacción de los clientes existentes.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: media
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero crear una encuesta de satisfacción para enviarla automáticamente 24 horas después de cada sesión individual, para medir la calidad percibida de mis entrenamientos y hacer ajustes rápidos.
- Como dueño de un estudio de fitness, quiero enviar una encuesta NPS (Net Promoter Score) de forma trimestral a todos mis clientes activos para medir la lealtad general e identificar promotores para mi programa de referidos y detractores que necesitan atención especial.
- Como coach online, quiero configurar una encuesta de 'check-in de objetivos' que se envíe automáticamente cada 4 semanas a los clientes con planes de larga duración, para monitorizar su progreso, motivación y ajustar sus planes de forma proactiva.
- Como entrenador, quiero tener un dashboard central donde pueda ver de un vistazo los resultados agregados de todas mis encuestas, con gráficos de tendencias, para identificar rápidamente si la satisfacción general de mis clientes está mejorando o empeorando.
- Como administrador del negocio, quiero que el sistema me genere una tarea automática en el perfil del cliente dentro de TrainerERP cada vez que una respuesta a una encuesta contenga una calificación por debajo de 3 estrellas, para asegurarme de que ningún cliente insatisfecho pase desapercibido.
- Como entrenador que busca crecer, quiero poder filtrar las respuestas de encuestas con las puntuaciones más altas para solicitar a esos clientes que dejen un testimonio público, vinculando el feedback directamente con mi estrategia de social proof.
## Acciones Clave
- Crear una nueva encuesta utilizando plantillas predefinidas (NPS, Satisfacción Post-Sesión, Check-in de Metas) o desde cero.
- Configurar disparadores de automatización para el envío de encuestas (ej: 'al completar sesión', 'X días después de iniciar plan', 'al alcanzar un hito').
- Visualizar el dashboard de resultados de encuestas con KPIs clave, gráficos de tendencias y nubes de palabras para respuestas abiertas.
- Explorar y filtrar respuestas individuales para entender el contexto de un cliente específico.
- Crear un segmento de clientes directamente desde los resultados de una encuesta (ej: 'Clientes Detractores con NPS < 6') para acciones de marketing o comunicación dirigidas.
- Marcar una respuesta como 'Testimonio Potencial' para seguimiento por parte del equipo de marketing.
## 🧩 Componentes React Sugeridos
### 1. SurveyBuilderContainer
Tipo: container | Componente principal que maneja la lógica y el estado para crear y editar una encuesta. Orquesta los sub-componentes como el editor de preguntas, la configuración de la automatización y la vista previa.
Props:
- surveyId: 
- string | null (opcional) - ID de la encuesta a editar. Si es nulo, se crea una nueva encuesta.
- onSave: 
- (surveyData: Survey) => void (requerido) - Callback que se ejecuta cuando el entrenador guarda la encuesta.
Estados: surveyTitle, questionsList, automationRules, isLoading, error
Dependencias: react-dnd (para reordenar preguntas), axios
Ejemplo de uso:
```typescript
<SurveyBuilderContainer surveyId='survey-123' onSave={(data) => console.log('Survey saved', data)} />
```

### 2. SurveySummaryCard
Tipo: presentational | Tarjeta de UI que muestra un resumen de una encuesta existente en el listado principal. Muestra el título, estado, tasa de respuesta y el KPI principal (ej. NPS o CSAT).
Props:
- title: 
- string (requerido) - Título de la encuesta.
- status: 
- 'active' | 'draft' | 'archived' (requerido) - Estado actual de la encuesta.
- responseRate: 
- number (requerido) - Porcentaje de respuestas (0 a 100).
- mainKpi: 
- { label: string; value: string | number } (requerido) - Métrica principal a destacar (ej. { label: 'NPS', value: 54 }).
Ejemplo de uso:
```typescript
<SurveySummaryCard title='Satisfacción Post-Sesión' status='active' responseRate={82} mainKpi={{ label: 'CSAT', value: '4.8/5' }} />
```

### 3. AutomationTriggerConfig
Tipo: presentational | Componente de formulario para configurar cuándo se debe enviar una encuesta. Permite seleccionar un evento (ej. 'Sesión completada') y un retraso.
Props:
- availableTriggers: 
- Array<{ id: string; name: string }> (requerido) - Lista de eventos de sistema disponibles que pueden disparar una encuesta.
- value: 
- { triggerId: string; delay: number; unit: 'hours' | 'days' } (requerido) - El valor actual de la configuración de la automatización.
- onChange: 
- (newValue: object) => void (requerido) - Función que se llama cuando el usuario cambia la configuración.
Ejemplo de uso:
```typescript
<AutomationTriggerConfig availableTriggers={triggers} value={automationRule} onChange={setAutomationRule} />
```

### 4. useSurveyResults
Tipo: hook | Hook personalizado para abstraer la lógica de fetching y procesamiento de los datos de resultados de una encuesta específica.
Props:
- surveyId: 
- string (requerido) - ID de la encuesta de la cual se quieren obtener los resultados.
Estados: resultsData, isLoading, error
Dependencias: axios, swr (o react-query)
Ejemplo de uso:
```typescript
const { resultsData, isLoading } = useSurveyResults('survey-123');
```
## 🔌 APIs Requeridas
### 1. POST /api/feedback/surveys
Crea una nueva encuesta en el sistema para el entrenador autenticado.
Parámetros:
- surveyData (
- object, body, requerido): Objeto que contiene el título, descripción, preguntas y reglas de automatización de la encuesta.
Respuesta:
Tipo: object
Estructura: Devuelve el objeto de la encuesta recién creada, incluyendo su nuevo ID.
```json
{
  "id": "survey_abc123",
  "title": "Satisfacción Post-Sesión",
  "status": "draft",
  "createdAt": "2023-10-27T10:00:00Z",
  "questions": [
    {
      "id": "q1",
      "type": "rating_stars",
      "text": "¿Cómo calificarías tu sesión de hoy?"
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Los datos de la encuesta son inválidos o faltan campos obligatorios.
- 403: 
- Forbidden - El usuario no tiene permisos para crear encuestas (ej. rol incorrecto).

### 2. GET /api/feedback/surveys
Obtiene una lista de todas las encuestas creadas por el entrenador autenticado.
Parámetros:
- status (
- string, query, opcional): Filtra las encuestas por estado ('active', 'draft', 'archived').
Respuesta:
Tipo: array
Estructura: Un array de objetos, donde cada objeto es un resumen de una encuesta.
```json
[
  {
    "id": "survey_abc123",
    "title": "Satisfacción Post-Sesión",
    "status": "active",
    "responseRate": 82,
    "mainKpi": {
      "label": "CSAT",
      "value": "4.8/5"
    }
  },
  {
    "id": "survey_def456",
    "title": "NPS Trimestral Q4",
    "status": "draft",
    "responseRate": 0,
    "mainKpi": {
      "label": "NPS",
      "value": "N/A"
    }
  }
]
```
Autenticación: Requerida
Errores posibles:
- 500: 
- Internal Server Error - Error al consultar la base de datos.

### 3. GET /api/feedback/surveys/{surveyId}/results
Obtiene los resultados agregados y detallados para una encuesta específica.
Parámetros:
- surveyId (
- string, path, requerido): El ID de la encuesta a consultar.
Respuesta:
Tipo: object
Estructura: Objeto con estadísticas agregadas, desglose por pregunta y listado de respuestas individuales.
```json
{
  "summary": {
    "totalResponses": 150,
    "responseRate": 75,
    "nps": 60
  },
  "breakdown": [
    {
      "questionId": "q1",
      "type": "nps",
      "promoters": 100,
      "passives": 30,
      "detractors": 20
    }
  ],
  "individualResponses": [
    {
      "responseId": "resp_001",
      "clientId": "client_xyz",
      "submittedAt": "...",
      "answers": [
        {
          "q1": 9
        }
      ]
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - La encuesta con el ID especificado no existe o no pertenece al usuario.

### 4. POST /api/feedback/automations
Crea o actualiza una regla de automatización para una encuesta.
Parámetros:
- automationData (
- object, body, requerido): Objeto que contiene el surveyId, el evento disparador y el retraso.
Respuesta:
Tipo: object
Estructura: Devuelve el objeto de la automatización creada o actualizada.
```json
{
  "id": "auto_xyz789",
  "surveyId": "survey_abc123",
  "triggerEvent": "session_completed",
  "delayInHours": 24,
  "isActive": true
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Datos de automatización inválidos, como un triggerEvent que no existe.
## Notas Técnicas
Colecciones backend: surveys, survey_questions, survey_responses, survey_automations, clients
KPIs visibles: Tasa de Respuesta de Encuestas (%), Net Promoter Score (NPS) Global y por segmento, Puntuación Media de Satisfacción del Cliente (CSAT), Número de Clientes en Riesgo (identificados por feedback negativo recurrente), Tendencia de Satisfacción (Comparativa Mes a Mes), Temas Clave en Respuestas Abiertas (Nube de palabras)
## Documentación Completa
## Resumen
El módulo de 'Feedback Loop & Encuestas Inteligentes' es una herramienta estratégica dentro de TrainerERP, diseñada para fortalecer el área funcional de 'CONFIANZA & SOCIAL PROOF'. Su propósito es permitir a los entrenadores personales y centros de fitness capturar sistemáticamente la voz del cliente, transformando opiniones y sentimientos en datos estructurados y accionables. A través de la creación de encuestas personalizadas y la configuración de disparadores automáticos inteligentes, los entrenadores pueden mantener un pulso constante sobre la satisfacción del cliente, la percepción de su progreso y su lealtad general (NPS). Este sistema no solo ayuda a mejorar la calidad del servicio de entrenamiento de forma continua, sino que también funciona como un sistema de alerta temprana para identificar clientes en riesgo de abandono. Además, las respuestas positivas se convierten en un activo invaluable, proporcionando testimonios auténticos que pueden ser utilizados en marketing para atraer nuevos clientes. En definitiva, esta funcionalidad cierra el círculo entre la prestación del servicio, la percepción del cliente y la mejora del negocio, convirtiendo el feedback en el motor de la retención y el crecimiento.
## Flujo paso a paso de uso real
Imaginemos a **Carlos, un entrenador personal** que utiliza TrainerERP para gestionar su negocio. Quiere asegurarse de que sus clientes estén contentos y progresando adecuadamente.
1. **Creación de la Encuesta:** Carlos navega a la sección `Feedback > Encuestas` en su dashboard. Hace clic en 'Crear Nueva Encuesta' y elige la plantilla 'Check-in de Progreso Mensual'.
2. **Personalización:** La plantilla ya incluye preguntas clave como '¿Cómo calificarías tu progreso este mes (1-5)?' y '¿Qué ha sido lo más desafiante?'. Carlos añade una pregunta de opción múltiple: '¿En qué te gustaría enfocarte el próximo mes? (Fuerza, Resistencia, Nutrición, Flexibilidad)'.
3. **Configuración de la Automatización:** En la pestaña 'Automatización', Carlos crea una nueva regla. Selecciona el disparador `Cliente cumple 30 días en el plan actual`. Establece un retraso de 0 horas. Esto significa que exactamente 30 días después de que un cliente inicie un plan, recibirá la encuesta.
4. **Activación:** Carlos revisa la encuesta, la guarda y la activa.
5. **Ejecución Automática:** Un mes después, su clienta, **Ana**, que empezó su plan 'Transformación 12 Semanas' hace 30 días, recibe automáticamente una notificación push y un email de TrainerERP con un enlace a la encuesta.
6. **Respuesta del Cliente:** Ana abre el enlace en su móvil. Califica su progreso con un 4, escribe que lo más desafiante ha sido la constancia con la dieta, y selecciona 'Fuerza' para el próximo mes. Tarda menos de 2 minutos.
7. **Análisis y Acción:** Carlos recibe una notificación de la nueva respuesta. En su dashboard de 'Feedback', ve que la puntuación de satisfacción general se mantiene alta. Abre la respuesta de Ana. La información es oro puro: sabe que debe hablar con ella sobre estrategias de adherencia a la dieta en su próxima sesión y ya tiene claro que el próximo mes el foco del entrenamiento será la fuerza. El sistema ha facilitado una comunicación asíncrona pero increíblemente valiosa.
## Riesgos operativos y edge cases
- **Fatiga de Encuestas:** Si un entrenador configura demasiadas automatizaciones (post-sesión, semanal, mensual), puede abrumar a los clientes y provocar tasas de respuesta bajas. **Mitigación:** El sistema podría incluir una advertencia si se configuran más de 'X' encuestas para el mismo cliente en un período de 30 días.
- **Versioning de Encuestas:** Un entrenador edita una pregunta en una encuesta activa. ¿Cómo afecta esto a los resultados ya recogidos? **Mitigación:** Al guardar cambios en una encuesta activa, el sistema debe preguntar si se quiere 'crear una nueva versión'. Los análisis permitirían comparar resultados entre versiones para ver el impacto de los cambios.
- **Respuestas ambiguas o inútiles:** En preguntas abiertas, los clientes pueden dar respuestas cortas o poco claras. **Mitigación:** Aunque no se puede forzar la calidad, la IA se puede utilizar para analizar el sentimiento general y extraer palabras clave, dando al entrenador un resumen incluso de respuestas breves.
- **Encuestas a clientes incorrectos:** Una automatización mal configurada podría enviar una encuesta de 'fin de plan' a un cliente nuevo. **Mitigación:** La UI para configurar automatizaciones debe ser extremadamente clara, con resúmenes en lenguaje natural de la regla creada (ej. 'Enviar esta encuesta 1 día después de que finalice cualquier plan de entrenamiento').
## KPIs y qué significan
- **Tasa de Respuesta (%):** Mide cuántos clientes que reciben una encuesta la completan. Una tasa alta indica que los clientes están comprometidos y el canal de comunicación es efectivo. Una tasa baja puede indicar fatiga de encuestas o falta de interés.
- **Net Promoter Score (NPS):** Mide la lealtad. Se calcula a partir de la pregunta '¿Qué tan probable es que recomiendes nuestros servicios a un amigo?'. No es solo un número; un NPS alto (>50) significa que tienes un ejército de promotores que pueden generar referidos. Un NPS bajo o negativo es una señal de alarma crítica sobre la salud de tu negocio.
- **Puntuación de Satisfacción (CSAT):** Generalmente medida en una escala de 1 a 5, responde a preguntas específicas como '¿Qué tan satisfecho estás con tu última sesión?'. Es un indicador táctico para medir la calidad de interacciones concretas. Permite a los entrenadores identificar si una sesión o un tipo de entrenamiento específico está funcionando bien.
- **Clientes en Riesgo:** Este no es un KPI directo, sino un segmento derivado. Se define como clientes que consistentemente dan bajas puntuaciones (ej. CSAT < 3 o son Detractores en NPS). Identificar este número ayuda a priorizar esfuerzos de retención de forma proactiva.
## Diagramas de Flujo (Mermaid)
**Flujo de Automatización de Encuesta Post-Sesión:**
mermaid
graph TD
A[Cliente asiste y completa una 'Sesión de Entrenamiento'] --> B{Evento 'session_completed' registrado en TrainerERP};
B --> C{Sistema verifica si hay automatizaciones para este evento};
C -- Sí, existe una regla --> D[Se encola el envío de la encuesta 'Satisfacción Post-Sesión'];
D --> E[Esperar el retraso configurado (ej. 24 horas)];
E --> F[Enviar notificación (Email/Push) al cliente con enlace a la encuesta];
F --> G{¿Cliente responde?};
G -- Sí --> H[Respuesta guardada en la base de datos];
H --> I[Dashboard de Analytics se actualiza en tiempo real];
I --> J{¿Puntuación < 3 estrellas?};
J -- Sí --> K[Crear tarea automática para el entrenador: 'Contactar a Cliente X por feedback negativo'];
J -- No --> L[Fin del flujo];
G -- No (después de 72h) --> M[Marcar encuesta como 'no respondida'];
C -- No --> L;
