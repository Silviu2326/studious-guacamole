# Generador de ideas de contenido con IA

**Página padre:** Hola

---

# Generador de ideas de contenido con IA
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta herramienta está diseñada para los profesionales que gestionan el marketing y la comunicación del negocio. El 'Entrenador Personal (Administrador)' tendrá acceso completo y podrá ver el historial de generaciones de todo su equipo. El 'Entrenador Asociado' podrá usar la herramienta para generar contenido para sus clientes asignados o para el perfil general del estudio, pero no tendrá acceso a las generaciones de otros entrenadores.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/contenido/generador-ia
## Descripción Funcional
El 'Generador de ideas de contenido con IA' es una herramienta estratégica diseñada para eliminar el bloqueo creativo y optimizar el marketing de contenidos para los profesionales del fitness. A diferencia de los generadores de IA genéricos, esta funcionalidad está profundamente integrada en el ecosistema de TrainerERP. Analiza los objetivos comerciales activos del entrenador (como 'lanzar un nuevo programa de fuerza' o 'captar leads para entrenamiento online'), los segmentos de clientes existentes (por ejemplo, 'principiantes', 'clientes de alto valor', 'clientes en riesgo de abandono'), y el calendario de eventos del negocio (próximos retos, webinars o promociones). El entrenador puede especificar el formato deseado (Reel de Instagram, idea para post de blog, guion para un TikTok, tema para newsletter), el tono (motivacional, educativo, directo a la venta) y la audiencia objetivo. La IA entonces genera un listado de ideas de contenido altamente relevantes y específicas, incluyendo ganchos iniciales, puntos clave a tratar y llamadas a la acción efectivas. Esto no solo ahorra incontables horas de brainstorming, sino que también asegura que cada pieza de contenido esté alineada con una estrategia comercial, aumentando la efectividad de las campañas y mejorando el engagement con la comunidad.
## Valor de Negocio
El principal valor de esta herramienta es la transformación del marketing de contenidos de una tarea tediosa y especulativa a un proceso estratégico, eficiente y basado en datos. Para un entrenador personal, el tiempo es su recurso más valioso; cada hora dedicada a pensar qué publicar es una hora que no dedica a entrenar clientes o a hacer crecer su negocio. Este generador automatiza la fase de ideación, proporcionando contenido de calidad en segundos. Además, alinea el contenido con los objetivos comerciales reales, garantizando que el esfuerzo de marketing contribuya directamente a la captación de leads, la venta de programas y la retención de clientes. Esto se traduce en un Retorno de Inversión (ROI) de marketing mucho más alto. Para el negocio SaaS de TrainerERP, esta funcionalidad representa un diferenciador clave frente a competidores, posicionando la plataforma no solo como una herramienta de gestión, sino como un socio estratégico para el crecimiento. Es una característica 'pegajosa' (sticky feature) que aumenta el valor percibido del servicio, justifica planes de suscripción más altos y reduce la tasa de abandono (churn), ya que los usuarios dependen de ella para una función crítica de su negocio.
## Prioridad / Roadmap
- Impacto: medio
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal independiente, quiero generar 5 ideas de Reels para la próxima semana sobre 'cómo empezar en el gimnasio' para atraer a un público principiante y hacer crecer mi audiencia.
- Como gestor de un estudio de fitness, quiero obtener una lista de 10 temas para el blog del próximo trimestre, enfocados en 'nutrición y rendimiento', para posicionar nuestro estudio como una autoridad en el sector.
- Como coach online, quiero crear una secuencia de 3 emails para promocionar mi nuevo programa de 'Transformación en 90 días', con el objetivo de convertir leads de mi lista de correo.
- Como entrenador de grupos pequeños, quiero ideas para historias de Instagram interactivas (encuestas, preguntas y respuestas) para aumentar el engagement con mi comunidad actual y fomentar la camaradería.
- Como un profesional con poco tiempo, quiero seleccionar mi objetivo actual ('Vender 5 plazas más para mi bootcamp') y que la IA me sugiera un plan de contenido de una semana para Facebook e Instagram para alcanzarlo.
## Acciones Clave
- Seleccionar el objetivo principal del contenido (ej: Captar leads, Vender un programa, Educar a la audiencia, Aumentar engagement).
- Definir la audiencia objetivo utilizando segmentos predefinidos de su CRM (ej: Clientes actuales, Principiantes, Avanzados) o describiéndola.
- Elegir el formato y la plataforma de contenido (ej: Reel de Instagram, Post de Blog, Newsletter, Guion de YouTube).
- Proporcionar palabras clave o un tema central para guiar a la IA (ej: 'entrenamiento funcional', 'recuperación post-parto').
- Ejecutar la generación de ideas y recibir una lista de sugerencias.
- Guardar las ideas favoritas en un 'Banco de Ideas' o asignarlas directamente a una fecha en el Calendario de Contenidos.
- Solicitar variaciones o una mayor elaboración de una idea específica que resulte interesante.
## 🧩 Componentes React Sugeridos
### 1. ContentIdeaGeneratorContainer
Tipo: container | Componente principal que orquesta la lógica de la página. Maneja el estado del formulario, las llamadas a la API a través de un hook, y la gestión de los resultados (ideas generadas).
Estados: formInputs: object, generatedIdeas: Idea[], isLoading: boolean, error: string | null, selectedIdea: Idea | null
Dependencias: useContentGeneratorAPI (custom hook)
Ejemplo de uso:
```typescript
<ContentIdeaGeneratorContainer />
```

### 2. GeneratorForm
Tipo: presentational | Renderiza el formulario con todos los campos necesarios para que el entrenador personal defina sus necesidades de contenido. Es un componente controlado que emite eventos de cambio y envío.
Props:
- inputs: 
- object (requerido) - Objeto con los valores actuales del formulario.
- onInputChange: 
- (field: string, value: any) => void (requerido) - Callback que se ejecuta cuando un campo del formulario cambia.
- onSubmit: 
- () => void (requerido) - Callback que se ejecuta al enviar el formulario.
- isLoading: 
- boolean (requerido) - Indica si se está procesando una solicitud, para deshabilitar el botón de envío.
Dependencias: antd (para componentes de UI como Select, Input, Button)
Ejemplo de uso:
```typescript
<GeneratorForm inputs={formInputs} onInputChange={handleInputChange} onSubmit={handleSubmit} isLoading={isLoading} />
```

### 3. IdeaCard
Tipo: presentational | Muestra una única idea de contenido generada. Incluye el título, la descripción, hashtags sugeridos y botones de acción.
Props:
- idea: 
- { id: string; title: string; description: string; format: 'reel' | 'post' | 'blog'; hashtags: string[]; } (requerido) - El objeto de la idea a renderizar.
- onSave: 
- (id: string) => void (requerido) - Callback para guardar la idea en el banco de ideas.
- onSchedule: 
- (id: string) => void (requerido) - Callback para abrir un modal y programar la idea en el calendario.
- onDiscard: 
- (id: string) => void (requerido) - Callback para descartar la idea.
Dependencias: react-icons
Ejemplo de uso:
```typescript
<IdeaCard idea={someIdea} onSave={handleSave} onSchedule={handleSchedule} onDiscard={handleDiscard} />
```

### 4. useContentGeneratorAPI
Tipo: hook | Hook personalizado para abstraer la comunicación con el backend. Maneja los estados de carga, error y datos para la generación de contenido.
Estados: data: Idea[] | null, isLoading: boolean, error: Error | null
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
const { generate, data, isLoading, error } = useContentGeneratorAPI();
const handleGenerate = () => generate(formInputs);
```
## 🔌 APIs Requeridas
### 1. POST /api/v1/content/generate
Envía una solicitud para generar ideas de contenido basadas en los parámetros del usuario. Esta es la API principal de la funcionalidad.
Parámetros:
- generationRequest (
- object, body, requerido): Objeto que contiene todos los parámetros para la generación.
Respuesta:
Tipo: object
Estructura: Un objeto que contiene un array de ideas generadas y metadatos sobre la solicitud. { ideas: [{ id, title, description, hook, cta, hashtags, format }], credits_consumed: number }
```json
{
  "ideas": [
    {
      "id": "gen_a1b2c3d4",
      "title": "3 Mitos sobre las Sentadillas que DEBES conocer",
      "description": "Un Reel rápido desmintiendo mitos comunes sobre las sentadillas. 1. 'Dañan las rodillas' -> Falso, si la técnica es buena las fortalece. 2. 'Los pies deben estar rectos' -> Falso, dependen de tu anatomía. 3. 'No puedes pasar las rodillas de la punta de los pies' -> Falso, es un movimiento natural.",
      "hook": "¿Tus rodillas te duelen al hacer sentadillas? Quizás crees en uno de estos mitos...",
      "cta": "¡Comenta 'SENTADILLA' si quieres mi guía gratuita de técnica!",
      "hashtags": [
        "#sentadillas",
        "#tecnicaejercicio",
        "#entrenamientofuncional",
        "#fitnessmitos"
      ],
      "format": "reel"
    }
  ],
  "credits_consumed": 5
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Los parámetros de entrada son inválidos o faltan.
- 429: 
- Too Many Requests - El usuario ha excedido su cuota de generación de ideas (límite de créditos).
- 503: 
- Service Unavailable - El servicio de IA subyacente no está disponible.

### 2. GET /api/v1/content/ideas
Obtiene la lista de ideas de contenido que el usuario ha guardado previamente en su 'Banco de Ideas'.
Parámetros:
- limit (
- number, query, opcional): Número de resultados a devolver.
- offset (
- number, query, opcional): Número de resultados a saltar para paginación.
Respuesta:
Tipo: array
Estructura: Un array de objetos de ideas guardadas, que incluye el contenido original y metadatos como la fecha en que se guardó.
```json
[
  {
    "saved_id": "svd_x1y2z3",
    "saved_at": "2023-10-27T10:00:00Z",
    "original_idea": {
      "title": "3 Mitos sobre las Sentadillas que DEBES conocer",
      "description": "...",
      "format": "reel"
    },
    "status": "saved"
  }
]
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación no es válido o ha expirado.

### 3. POST /api/v1/content/ideas
Guarda una idea generada por la IA en el 'Banco de Ideas' del usuario para su uso futuro.
Parámetros:
- ideaToSave (
- object, body, requerido): El objeto completo de la idea generada que se desea guardar.
Respuesta:
Tipo: object
Estructura: El objeto de la idea recién guardada, con su nuevo ID de base de datos y timestamp.
```json
{
  "saved_id": "svd_x1y2z3",
  "saved_at": "2023-10-27T10:00:00Z",
  "original_idea": {
    "title": "3 Mitos sobre las Sentadillas que DEBES conocer"
  },
  "status": "saved"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - El objeto de la idea en el body no tiene el formato correcto.

### 4. DELETE /api/v1/content/ideas/{id}
Elimina una idea guardada del 'Banco de Ideas' del usuario.
Parámetros:
- id (
- string, path, requerido): El ID de la idea guardada (no el ID de generación).
Respuesta:
Tipo: object
Estructura: Un objeto de confirmación.
```json
{
  "success": true,
  "message": "Idea eliminada correctamente."
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ninguna idea guardada con el ID proporcionado.
- 403: 
- Forbidden - El usuario no tiene permiso para eliminar esta idea.
## Notas Técnicas
Colecciones backend: users, ai_generated_content, content_calendar_posts, client_segments, business_goals, api_usage_logs
KPIs visibles: Créditos de IA restantes para el mes (si aplica)., Número de ideas generadas en los últimos 30 días., Tasa de guardado (ideas guardadas / ideas generadas)., Ideas generadas por cada formato (gráfico de pastel: Reels, Posts, Blogs)., Temas más populares (nube de palabras con los temas más solicitados).
## Documentación Completa
## Resumen
El 'Generador de ideas de contenido con IA' es una funcionalidad premium dentro del área de 'CONTENIDO & REDES SOCIALES' de TrainerERP. Su objetivo es resolver uno de los mayores puntos de dolor para los entrenadores personales: la creación constante de contenido relevante y de alta calidad para sus canales digitales. Esta herramienta va más allá de un simple generador de texto; actúa como un estratega de marketing virtual. Se integra con datos clave del sistema, como los objetivos de negocio del entrenador (p. ej., 'lanzar nuevo bootcamp'), los segmentos de su clientela (p. ej., 'madres ocupadas') y su calendario de eventos. El entrenador interactúa a través de una interfaz sencilla donde define su objetivo, audiencia, formato y tema, y la IA le devuelve una lista de ideas de contenido curadas y específicas para su nicho, ahorrándole horas de trabajo y asegurando que su marketing esté siempre alineado con sus metas de crecimiento.
## Flujo paso a paso de uso real
Imaginemos a Sofía, una entrenadora personal especializada en entrenamiento funcional que usa TrainerERP.
1. **Definición del Objetivo:** Es lunes por la mañana y Sofía necesita planificar su contenido de la semana. Su objetivo principal es promocionar su nuevo 'Reto de Movilidad de 30 días'. Accede a la sección 'Contenido' y abre el 'Generador de ideas con IA'.
2. **Configuración de Parámetros:** En el formulario, Sofía selecciona:
* **Objetivo:** 'Vender un programa o servicio'.
* **Audiencia:** Selecciona un segmento pre-existente en su CRM: 'Clientes antiguos que no han comprado en 6 meses'.
* **Formato:** Elige 'Carrusel de Instagram (3-5 diapositivas)'.
* **Tema/Palabras clave:** Escribe 'movilidad articular, dolor de espalda, trabajo de oficina'.
3. **Generación:** Hace clic en 'Generar Ideas'. La interfaz muestra un indicador de carga. En unos 15 segundos, el sistema le presenta 5 ideas de carruseles.
4. **Selección y Refinamiento:** Sofía revisa las opciones. Una le llama la atención: '¿Tu silla de oficina te está oxidando? 5 ejercicios de movilidad para hacer en tu escritorio'. La idea incluye un título gancho, una descripción para cada diapositiva y una llamada a la acción: 'Envía 'MOVILIDAD' por DM para un descuento en mi nuevo reto'.
5. **Acción:** A Sofía le encanta. Hace clic en el botón 'Guardar en Banco de Ideas' para tenerla a mano. Luego, ve otra idea interesante y hace clic en 'Programar'. Se abre una vista de calendario, ella elige el miércoles a las 6:00 PM y la idea se añade como un borrador de post en su Calendario de Contenidos de TrainerERP. El sistema ya ha precargado el texto y los hashtags sugeridos. Sofía solo tendrá que crear las imágenes y darle a publicar.
En menos de 5 minutos, Sofía ha resuelto una tarea que antes le llevaba una hora, y el contenido generado es estratégico y está directamente enfocado en sus metas de negocio.
## Riesgos operativos y edge cases
- **Control de Costos:** La dependencia de APIs como OpenAI puede ser costosa. **Mitigación:** Implementar un sistema de 'créditos' por plan de suscripción. El Plan Básico podría tener 50 generaciones/mes, el Premium 200, etc. Esto controla los costos y sirve como incentivo para el upgrade.
- **Calidad del Contenido:** Si el prompt engineering no es sofisticado, las ideas pueden ser genéricas. **Mitigación:** Invertir en prompts complejos que incluyan ejemplos específicos del nicho fitness ('few-shot prompting'). Además, añadir un sistema de feedback (pulgar arriba/abajo) en cada idea generada para que el sistema pueda aprender y mejorar.
- **Uso Indebido y Contenido Inapropiado:** Un usuario podría intentar generar contenido dañino o fuera de los términos de servicio. **Mitigación:** Implementar filtros de contenido en la entrada del usuario y en la salida de la IA. Monitorear los logs en busca de patrones de uso sospechosos.
- **Dependencia de Terceros:** Una caída en la API de la IA externa dejaría la funcionalidad inoperativa. **Mitigación:** Implementar un sistema de 'circuit breaker' que deshabilite temporalmente la función y muestre un mensaje claro al usuario. Considerar tener un proveedor de IA secundario como fallback.
## KPIs y qué significan
- **Tasa de Adopción de la Funcionalidad:** (Usuarios que usan el generador / Usuarios activos totales). Mide si la herramienta es descubierta y percibida como valiosa. Un valor bajo puede indicar problemas de visibilidad o de propuesta de valor.
- **Ratio de Generación-a-Guardado:** (Ideas guardadas / Ideas generadas totales). Es un indicador clave de la calidad y relevancia de los resultados. Un ratio alto (ej: > 40%) significa que la IA está produciendo ideas que los usuarios consideran útiles. Un ratio bajo indica que las ideas son descartadas y la calidad debe mejorar.
- **Stickiness (DAU/MAU de la función):** (Usuarios diarios de la función / Usuarios mensuales de la función). Mide la frecuencia de uso. Un 'stickiness' alto indica que los usuarios integran la herramienta en su flujo de trabajo recurrente, lo cual es señal de un gran valor.
- **Coste de API por Usuario Activo:** (Coste total de la API de IA / Usuarios activos en la función). KPI financiero para asegurar la rentabilidad de la funcionalidad. Debe mantenerse por debajo de un umbral aceptable en relación con el ARPU (Ingreso Promedio por Usuario).
## Diagramas de Flujo (Mermaid)
**Flujo de Usuario:**
mermaid
graph TD
A[Usuario abre la página] --> B{Rellena el formulario de generación};
B --> C[Hace clic en 'Generar'];
C --> D[Sistema muestra estado de carga];
D --> E{Se muestran las ideas generadas};
E --> F[Usuario revisa las ideas];
F --> G1[Guarda idea en Banco];
F --> G2[Programa idea en Calendario];
F --> G3[Descarta idea];
F --> G4[Solicita más variaciones];
**Flujo de Sistema:**
mermaid
sequenceDiagram
participant Frontend
participant TrainerERP_Backend as Backend
participant AI_Service as AI Service
Frontend->>Backend: POST /api/v1/content/generate (con parámetros)
Backend->>Backend: Valida y sanea los parámetros del usuario
Backend->>Backend: Construye un prompt detallado y estructurado
Backend->>AI_Service: Envía solicitud con el prompt
AI_Service-->>Backend: Devuelve la respuesta generada (JSON)
Backend->>Backend: Parsea y formatea la respuesta
Backend->>Backend: Registra el uso de créditos en la DB
Backend-->>Frontend: 200 OK con la lista de ideas formateadas
