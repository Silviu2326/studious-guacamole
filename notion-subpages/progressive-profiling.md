# Progressive Profiling

**Página padre:** Hola

---

# Progressive Profiling
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Principalmente para el Entrenador Personal (Administrador) que diseña las estrategias de captación. Un Entrenador Asociado podría tener permisos de solo lectura para ver las secuencias existentes, pero no para crearlas o modificarlas, dependiendo de la configuración de roles del estudio.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/marketing/progressive-profiling
## Descripción Funcional
El módulo de 'Progressive Profiling' es una herramienta estratégica dentro de TrainerERP diseñada para que los entrenadores puedan construir un perfil detallado y matizado de sus clientes potenciales (leads) de forma gradual y no intrusiva. En lugar de presentar un formulario inicial largo y abrumador que puede disuadir a muchos, este sistema permite crear 'secuencias de perfilado'. Estas secuencias consisten en una serie de preguntas clave distribuidas a lo largo de diferentes puntos de contacto en el embudo de conversión. Por ejemplo, una primera pregunta sobre el 'objetivo principal' (p. ej., perder peso, ganar músculo) puede hacerse en la landing page inicial. Días después, un email automático puede preguntar sobre 'experiencia previa en gimnasios'. Más adelante, otro punto de contacto podría indagar sobre 'lesiones o limitaciones físicas'. Cada respuesta se almacena automáticamente en el perfil del lead, enriqueciéndolo progresivamente. Esto permite al entrenador segmentar a sus leads con una precisión increíble, personalizar la comunicación y, en última instancia, presentar ofertas de entrenamiento altamente relevantes que resuenen con las necesidades y motivaciones específicas de cada individuo, aumentando drásticamente la probabilidad de conversión de lead a cliente.
## Valor de Negocio
El valor de negocio del Progressive Profiling para un entrenador personal es transformador. En un mercado competitivo, la personalización es la clave para destacar. Esta herramienta permite pasar de una captación genérica a una conversación personalizada y automatizada a escala. Al recopilar datos de forma gradual, se reduce la fricción inicial y aumenta la tasa de captura de leads. Más importante aún, la calidad de la información obtenida es muy superior. El entrenador no solo sabe que alguien está interesado, sino que entiende *por qué* y *cómo* ayudarle. Esto permite: 1) Aumentar las tasas de conversión al ofrecer planes específicos (ej. un 'Plan de Inicio Post-lesión' a alguien que mencionó una limitación). 2) Mejorar la eficiencia del marketing al crear segmentos ultra-específicos para campañas de email o retargeting. 3) Acelerar el proceso de venta, ya que en la primera llamada de consulta el entrenador ya posee un conocimiento profundo del lead. 4) Aumentar el valor de vida del cliente (LTV) al iniciar la relación con una solución perfectamente adaptada, lo que mejora la satisfacción y retención desde el primer día.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: media
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero crear una secuencia de preguntas para que se muestren a los leads en diferentes etapas de mi embudo de ventas, para poder recopilar información relevante sin abrumarlos.
- Como administrador de un estudio de fitness, quiero poder definir diferentes tipos de respuestas (texto libre, opción múltiple, escala numérica) para mis preguntas de perfilado, para obtener datos estructurados.
- Como entrenador online, quiero que las respuestas de un lead se guarden automáticamente en su ficha de CRM, para tener todo el contexto en un solo lugar antes de contactarlo.
- Como coach de grupo, quiero poder asignar etiquetas (tags) automáticamente a los leads según sus respuestas (ej. 'interesado_en_clases_grupales'), para segmentar mis campañas de email marketing.
- Como entrenador, quiero ver un resumen del progreso de perfilado de cada lead (qué preguntas ha respondido) para saber cuán 'calificado' está.
## Acciones Clave
- Crear una nueva secuencia de perfilado.
- Añadir/editar/eliminar preguntas dentro de una secuencia.
- Definir el tipo de respuesta para cada pregunta (ej. opción única, múltiple, texto).
- Asociar acciones automáticas a las respuestas (ej. añadir una etiqueta 'lesion_rodilla').
- Activar/desactivar secuencias de perfilado para vincularlas a embudos o landing pages.
- Visualizar las estadísticas de una secuencia (tasa de respuesta, puntos de abandono).
- Integrar preguntas de la secuencia en formularios de landing pages o cuerpos de emails.
## 🧩 Componentes React Sugeridos
### 1. ProfilingSequenceBuilder
Tipo: container | Componente principal que orquesta la creación y edición de una secuencia de perfilado completa. Permite añadir, reordenar y configurar preguntas.
Props:
- sequenceId: 
- string | null (opcional) - ID de la secuencia a editar. Si es nulo, se crea una nueva.
- onSave: 
- (sequence: ProfilingSequence) => void (requerido) - Callback que se ejecuta al guardar la secuencia.
Estados: sequenceName, questionsList, activeQuestionId, isLoading, error
Dependencias: react-beautiful-dnd (para reordenar preguntas)
Ejemplo de uso:
```typescript
<ProfilingSequenceBuilder sequenceId='seq_123' onSave={handleSequenceSave} />
```

### 2. QuestionEditor
Tipo: presentational | Formulario para crear o editar una pregunta específica dentro de la secuencia. Incluye el texto de la pregunta, tipo de respuesta, opciones, y acciones automáticas (tags).
Props:
- question: 
- Question (requerido) - Objeto con los datos de la pregunta a editar.
- onChange: 
- (updatedQuestion: Question) => void (requerido) - Función que se llama cada vez que un campo de la pregunta cambia.
- availableTags: 
- string[] (requerido) - Lista de todas las etiquetas disponibles en el sistema para asociar a las respuestas.
Dependencias: Chakra UI (o cualquier librería de componentes)
Ejemplo de uso:
```typescript
<QuestionEditor question={currentQuestion} onChange={updateQuestionInList} availableTags={['Principiante', 'Avanzado']} />
```

### 3. useProfilingData
Tipo: hook | Hook personalizado para abstraer la lógica de fetching y manipulación de datos de las secuencias de perfilado.
Props:
- sequenceId: 
- string | null (opcional) - ID de la secuencia a cargar.
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
const { sequence, updateSequence, isLoading, error } = useProfilingData('seq_123');
```

### 4. SequenceAnalyticsCard
Tipo: presentational | Tarjeta que muestra los KPIs clave de una secuencia de perfilado específica, como la tasa de finalización y el punto de abandono.
Props:
- stats: 
- { completionRate: number; dropOffQuestion: string; totalResponses: number; } (requerido) - Objeto con las estadísticas de la secuencia.
Dependencias: recharts (para visualizaciones)
Ejemplo de uso:
```typescript
<SequenceAnalyticsCard stats={{ completionRate: 75, dropOffQuestion: '¿Tienes lesiones?', totalResponses: 150 }} />
```
## 🔌 APIs Requeridas
### 1. POST /api/profiling/sequences
Crea una nueva secuencia de perfilado con un nombre y una lista inicial de preguntas.
Parámetros:
- name (
- string, body, requerido): Nombre de la secuencia (ej. 'Embudo de Consulta Gratuita').
- questions (
- Array<Question>, body, opcional): Lista de objetos de pregunta que componen la secuencia.
Respuesta:
Tipo: object
Estructura: El objeto de la secuencia recién creada, incluyendo su ID.
```json
{
  "id": "seq_a1b2c3d4",
  "name": "Embudo de Consulta Gratuita",
  "status": "draft",
  "createdAt": "2023-10-27T10:00:00Z",
  "questions": []
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - El nombre está vacío o el formato de las preguntas es incorrecto.
- 401: 
- Unauthorized - El usuario no tiene permisos para crear secuencias.

### 2. PUT /api/profiling/sequences/{sequenceId}
Actualiza una secuencia de perfilado existente, incluyendo su nombre y la lista/orden de preguntas.
Parámetros:
- sequenceId (
- string, path, requerido): ID de la secuencia a actualizar.
- name (
- string, body, opcional): Nuevo nombre de la secuencia.
- questions (
- Array<Question>, body, opcional): La lista completa y actualizada de preguntas en el nuevo orden.
Respuesta:
Tipo: object
Estructura: El objeto de la secuencia completamente actualizado.
```json
{
  "id": "seq_a1b2c3d4",
  "name": "Embudo Actualizado de Consulta Gratuita",
  "status": "active",
  "updatedAt": "2023-10-27T11:00:00Z",
  "questions": [
    {
      "id": "q_1",
      "text": "¿Cuál es tu objetivo principal?",
      "type": "multiple_choice",
      "options": [
        "Perder peso",
        "Ganar músculo",
        "Mejorar condición"
      ]
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - La secuencia con el ID proporcionado no existe.
- 400: 
- Bad Request - El formato de los datos es inválido.

### 3. GET /api/profiling/sequences
Obtiene una lista de todas las secuencias de perfilado creadas por el entrenador.
Respuesta:
Tipo: array
Estructura: Una lista de objetos de secuencia, cada uno con su ID, nombre, estado y número de preguntas.
```json
[
  {
    "id": "seq_a1b2c3d4",
    "name": "Embudo de Consulta Gratuita",
    "status": "active",
    "questionCount": 5,
    "completionRate": 0.82
  },
  {
    "id": "seq_e5f6g7h8",
    "name": "Lead Magnet: Guía de Nutrición",
    "status": "draft",
    "questionCount": 3,
    "completionRate": 0
  }
]
```
Autenticación: Requerida
Errores posibles:
- 500: 
- Internal Server Error - Error al consultar la base de datos.

### 4. POST /api/public/leads/answers
Endpoint PÚBLICO para que un lead envíe una respuesta a una pregunta de perfilado. Usado por formularios, widgets o emails.
Parámetros:
- leadToken (
- string, body, requerido): Token único que identifica al lead de forma anónima y segura.
- questionId (
- string, body, requerido): ID de la pregunta que se está respondiendo.
- answerValue (
- any, body, requerido): El valor de la respuesta (string, array de strings, número).
Respuesta:
Tipo: object
Estructura: Un objeto de confirmación.
```json
{
  "success": true,
  "message": "Respuesta registrada correctamente."
}
```
Autenticación: No requerida
Errores posibles:
- 400: 
- Bad Request - Faltan parámetros o el token del lead es inválido.
- 404: 
- Not Found - La pregunta con el ID especificado no existe o no está activa.

### 5. GET /api/leads/{leadId}/profile
Obtiene el perfil completo de un lead, incluyendo todas las respuestas de perfilado progresivo que ha proporcionado.
Parámetros:
- leadId (
- string, path, requerido): ID del lead cuyo perfil se quiere consultar.
Respuesta:
Tipo: object
Estructura: Un objeto con los datos del lead y una lista de sus respuestas.
```json
{
  "leadId": "lead_xyz",
  "email": "potencial.cliente@email.com",
  "profileData": [
    {
      "questionText": "¿Cuál es tu objetivo principal?",
      "answerValue": "Perder peso",
      "answeredAt": "2023-10-26T10:00:00Z"
    },
    {
      "questionText": "¿Tienes alguna lesión o limitación?",
      "answerValue": "Dolor lumbar ocasional",
      "answeredAt": "2023-10-27T14:00:00Z"
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El lead con el ID proporcionado no existe.
## Notas Técnicas
Colecciones backend: profiling_sequences, profiling_questions, lead_profiles, lead_answers
KPIs visibles: Tasa de finalización de secuencia (Sequence Completion Rate), Tasa de respuesta por pregunta (Per-Question Answer Rate), Punto de abandono más común (Highest Drop-off Point), Número de perfiles enriquecidos por semana, Tasa de conversión de leads con perfil completo vs. perfil incompleto
## Documentación Completa
## Resumen
El sistema de Perfilado Progresivo (Progressive Profiling) es una herramienta de marketing y ventas diseñada para mejorar la captura y calificación de leads dentro de TrainerERP. Su filosofía se basa en recopilar información sobre un cliente potencial de manera gradual a lo largo de múltiples interacciones, en lugar de solicitar una gran cantidad de datos en el primer contacto. Esto reduce la fricción, aumenta las tasas de conversión de los formularios iniciales y permite construir un perfil psicológico y logístico del lead mucho más rico y preciso.
Para el entrenador personal, esto significa poder segmentar su base de leads con una granularidad sin precedentes. Podrá diferenciar entre alguien que busca perder peso, tiene experiencia previa y disponibilidad por las mañanas, de otro lead que quiere ganar músculo, es principiante y solo puede entrenar los fines de semana. Esta información permite una personalización masiva y automatizada de la comunicación, la oferta de servicios y, en última instancia, del programa de entrenamiento propuesto, lo que incrementa significativamente las posibilidades de cerrar la venta.
## Flujo paso a paso de uso real
Imaginemos a Ana, una entrenadora personal especializada en recuperación post-parto.
1. **Creación de la Secuencia**: Ana entra a la sección 'Progressive Profiling' en TrainerERP y crea una nueva secuencia llamada "Captación Mamás Fit".
2. **Pregunta #1 (Landing Page)**: La primera pregunta es crucial y de baja fricción. Ana la configura para su formulario de descarga de un lead magnet ('Guía de 5 ejercicios seguros post-parto'). La pregunta es: *"¿Cuál es tu mayor reto ahora mismo?"* con opciones: 'Recuperar mi figura', 'Ganar energía', 'Fortalecer el suelo pélvico'.
3. **Pregunta #2 (Email de Bienvenida)**: Dentro del email automático que entrega la guía, Ana incrusta la siguiente pregunta: *"¿Cuánto tiempo ha pasado desde el parto?"* con opciones: 'Menos de 3 meses', '3-6 meses', 'Más de 6 meses'. Basado en la respuesta, Ana puede aplicar una etiqueta automática ('Fase_Inicial', 'Fase_Intermedia').
4. **Pregunta #3 (Email de Seguimiento)**: Dos días después, otro email pregunta: *"¿Has tenido alguna complicación como diástasis de rectos?"* (Sí/No). Una respuesta afirmativa podría activar una notificación interna para que Ana contacte a este lead personalmente, ya que requiere atención especial.
5. **Pregunta #4 (SMS/WhatsApp)**: Para los leads más comprometidos (que han abierto todos los emails), Ana puede enviar un SMS una semana después: *"Hola [Nombre], para adaptar mejor mis propuestas, ¿prefieres entrenar online o presencial en nuestro estudio?"*.
6. **Consulta de Venta**: Cuando Ana finalmente tiene una llamada con un lead, abre su perfil en TrainerERP y ve todas las respuestas. Sabe que la lead tuvo a su bebé hace 4 meses, su principal reto es ganar energía, sospecha tener diástasis y prefiere entrenar online. Ana puede empezar la conversación diciendo: "He visto que tu foco es recuperar la energía, lo cual es totalmente normal 4 meses post-parto. Tengo un programa online específico para eso que además cuida la diástasis que mencionaste..." La conexión y la percepción de expertise son inmediatas.
## Riesgos operativos y edge cases
* **Exceso de preguntas**: Si el entrenador configura demasiadas preguntas en un corto período, puede generar fatiga y percepción de spam, llevando al lead a darse de baja. El sistema debería tener salvaguardas o recomendaciones sobre la frecuencia.
* **Privacidad de datos de salud**: Preguntas sobre lesiones, condiciones médicas o estado post-parto son datos sensibles. Es imperativo que TrainerERP garantice el cumplimiento de normativas como RGPD, informando al lead del uso de sus datos y obteniendo consentimiento explícito. Los datos deben estar encriptados en reposo y en tránsito.
* **Edición de secuencias activas**: Si un entrenador modifica una pregunta que ya ha sido enviada a 100 leads, el sistema debe tener un protocolo claro. ¿Se invalida la pregunta anterior? ¿Se mantiene para los que ya la vieron? La mejor práctica sería versionar las secuencias.
* **Canales de respuesta**: El sistema debe ser robusto para recibir respuestas desde múltiples canales (formularios web, clicks en emails, respuestas a SMS) y atribuirlas correctamente al lead correspondiente.
## KPIs y qué significan
* **Tasa de finalización de secuencia**: (Leads que responden la última pregunta / Leads que responden la primera) * 100. Un valor alto indica que la secuencia es atractiva y las preguntas son relevantes. Un valor bajo sugiere que es demasiado larga, intrusiva o aburrida.
* **Tasa de respuesta por pregunta**: Mide el engagement de cada pregunta individualmente. Permite identificar qué preguntas son efectivas y cuáles generan fricción o abandono.
* **Punto de abandono más común**: La pregunta con la mayor caída en la tasa de respuesta comparada con la anterior. Es el punto débil de la secuencia que necesita ser optimizado (quizás la pregunta es muy personal, confusa o irrelevante en esa etapa).
* **Tiempo medio para completar perfil**: El tiempo que tarda un lead desde la primera respuesta hasta la última. Ayuda a entender la duración del ciclo de calificación.
* **Tasa de conversión (Perfil Completo vs. Incompleto)**: Compara el porcentaje de ventas cerradas de leads que completaron la secuencia versus los que no. Este es el KPI definitivo que demuestra el ROI de la funcionalidad.
## Diagramas de Flujo
mermaid
graph TD
A[Lead llega a Landing Page] --> B{Ve formulario con Pregunta #1};
B --> C{Responde P#1 y se suscribe};
C --> D[Recibe Email de Bienvenida con Pregunta #2];
D --> E{Hace clic en respuesta de P#2};
E --> F[Datos guardados en perfil del Lead];
F --> G{Segmentación automática basada en respuestas};
G --> H[Recibe Email de seguimiento con P#3];
H --> I{Ignora o responde P#3};
I --> J[Perfil del Lead se enriquece continuamente];
J --> K[Entrenador revisa perfil completo antes de la llamada];
K --> L[Ofrece plan 100% personalizado];
