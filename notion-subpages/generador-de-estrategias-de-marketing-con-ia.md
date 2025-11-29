# Generador de estrategias de marketing con IA

**Página padre:** Hola

---

# Generador de estrategias de marketing con IA
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad está diseñada para los profesionales que gestionan el negocio, es decir, el 'Entrenador Personal (Administrador)' y los 'Entrenadores Asociados'. Permite a los entrenadores planificar y ejecutar estrategias de marketing para hacer crecer su negocio. El rol de Administrador podría tener acceso a datos de negocio más amplios para alimentar a la IA (ej. KPIs de todo el estudio), mientras que un Entrenador Asociado podría tener un alcance limitado a sus propios clientes.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/marketing/ia-estrategias
## Descripción Funcional
El 'Generador de estrategias de marketing con IA' es una herramienta avanzada dentro de TrainerERP diseñada para actuar como un consultor de marketing virtual para entrenadores personales. Su objetivo principal es eliminar la incertidumbre y la complejidad del marketing digital, proporcionando planes de acción claros, personalizados y eficaces. El sistema funciona a través de un asistente interactivo donde el entrenador introduce información clave sobre su negocio: su nicho de especialización (ej. entrenamiento de fuerza para mayores de 40, preparación para maratones, fitness post-parto), el perfil de su cliente ideal, sus objetivos de negocio a corto y largo plazo (ej. conseguir 10 nuevos clientes online, lanzar un reto de grupo), su presupuesto de marketing, y los canales que prefiere utilizar. Con esta información, el motor de IA, pre-entrenado con miles de casos de éxito en el sector del fitness, genera una estrategia de marketing completa y detallada. Esta estrategia puede abarcar desde un plan de contenidos para redes sociales para los próximos 30, 60 o 90 días, hasta el diseño de una campaña de lanzamiento estacional completa (ej. 'Operación Verano'), incluyendo copys para anuncios, secuencias de email marketing, y la estructura de una landing page de alta conversión. Además, la herramienta puede proponer estrategias de retención de clientes y sugerir colaboraciones estratégicas con otros profesionales del sector, como nutricionistas o fisioterapeutas, para crear ofertas conjuntas y ampliar el alcance.
## Valor de Negocio
El valor de negocio de esta herramienta es transformacional para el entrenador personal. Muchos entrenadores son expertos en fisiología y entrenamiento, pero no en marketing y ventas. Esta herramienta cierra esa brecha, democratizando el acceso a estrategias de marketing de alto nivel sin el costo de una agencia. Su principal valor radica en el ahorro de tiempo y la reducción de la parálisis por análisis; en lugar de pasar horas investigando qué publicar o cómo estructurar una campaña, el entrenador obtiene un plan de acción en minutos. Esto se traduce directamente en un aumento de la capacidad para captar nuevos clientes (aumento de ingresos) y retener a los existentes (aumento del LTV). Además, posiciona a TrainerERP como un socio estratégico para el crecimiento del negocio, no solo como un software de gestión. Esto fortalece la propuesta de valor del SaaS, justifica la permanencia en planes de suscripción más altos y reduce la tasa de abandono (churn). Al proporcionar estrategias personalizadas y probadas, aumenta la probabilidad de éxito de las iniciativas de marketing del entrenador, lo que a su vez refuerza su confianza y el valor percibido del software.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Premium
## User Stories
- Como entrenador personal independiente, quiero generar un plan de contenido para Instagram para los próximos 30 días, enfocado en mi nicho de 'recuperación post-lesión', para poder atraer a clientes que necesiten mis servicios especializados y posicionarme como un experto.
- Como dueño de un estudio de fitness, quiero crear una estrategia de marketing completa para nuestra campaña de 'Año Nuevo, Nuevo Tú', que incluya ideas para anuncios, una secuencia de emails y un calendario de publicaciones, para maximizar las inscripciones en enero.
- Como coach online, quiero obtener sugerencias de estrategias de retención para clientes que llevan más de 6 meses conmigo, incluyendo ideas de ofertas exclusivas o comunicaciones especiales, para reducir el abandono y aumentar su valor de vida.
- Como nuevo entrenador con un presupuesto limitado, quiero generar un plan de marketing de bajo costo para mis primeros 90 días, enfocado en crecimiento orgánico y colaboraciones locales, para poder construir mi base de clientes sin una gran inversión inicial.
- Como entrenador que quiere diversificar ingresos, quiero que la IA me sugiera ideas para crear y promocionar un infoproducto, como una 'Guía de Nutrición para Ganar Masa Muscular', para poder generar ingresos pasivos.
## Acciones Clave
- Seleccionar el tipo de estrategia a generar (Plan de Contenido, Campaña de Lanzamiento, Estrategia de Retención, Ideas de Colaboración).
- Completar un formulario guiado (wizard) con los parámetros de entrada para la IA (objetivos, audiencia, nicho, presupuesto, tono).
- Iniciar el proceso de generación de la estrategia y visualizar una barra de progreso o estado.
- Ver la estrategia generada en una vista organizada y fácil de leer, con secciones claras y tareas accionables.
- Guardar la estrategia en el sistema para futuras consultas o modificaciones.
- Exportar la estrategia a PDF o integrarla directamente con otras herramientas de TrainerERP como el Calendario de Contenidos o el módulo de Email Marketing.
## 🧩 Componentes React Sugeridos
### 1. StrategyGeneratorWizard
Tipo: container | Componente principal que gestiona el flujo de varios pasos para recopilar la información del usuario necesaria para generar la estrategia. Maneja el estado de los datos del formulario y el paso actual.
Props:
- onSubmit: 
- (formData: StrategyInputData) => void (requerido) - Función que se llama cuando el usuario completa todos los pasos y envía el formulario.
Estados: currentStep: number, formData: StrategyInputData
Dependencias: react-hook-form
Ejemplo de uso:
```typescript
<StrategyGeneratorWizard onSubmit={(data) => generateStrategy(data)} />
```

### 2. StrategyOutputDisplay
Tipo: presentational | Muestra la estrategia generada por la IA de una manera estructurada y legible. Utiliza componentes internos para renderizar diferentes secciones como calendarios, listas de tareas o fragmentos de texto. Soporta formato Markdown.
Props:
- strategyData: 
- StrategyOutput (requerido) - El objeto JSON que contiene la estrategia completa devuelta por la API.
- isLoading: 
- boolean (opcional) - Si es true, muestra un esqueleto de carga o un spinner.
Dependencias: react-markdown
Ejemplo de uso:
```typescript
<StrategyOutputDisplay strategyData={generatedStrategy} isLoading={isGenerating} />
```

### 3. useAIStrategyGeneration
Tipo: hook | Hook personalizado que encapsula la lógica para interactuar con la API de generación de estrategias. Maneja los estados de carga, error y datos.
Estados: data: StrategyOutput | null, error: Error | null, isLoading: boolean
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
const { generate, data, isLoading, error } = useAIStrategyGeneration();

const handleSubmit = (formData) => {
 generate(formData);
};
```

### 4. TitledInputSection
Tipo: presentational | Componente de UI reutilizable para una sección del formulario del wizard, con un título, una descripción y varios campos de entrada (inputs, textareas, selects).
Props:
- title: 
- string (requerido) - El título de la sección (ej. 'Define tu Audiencia').
- description: 
- string (requerido) - Texto explicativo para guiar al usuario.
- children: 
- React.ReactNode (requerido) - Los campos del formulario para esta sección.
Ejemplo de uso:
```typescript
<TitledInputSection title='Objetivos' description='¿Qué quieres lograr con esta campaña?'><InputField name='goal' /></TitledInputSection>
```
## 🔌 APIs Requeridas
### 1. POST /api/marketing/ai/strategies
Crea y genera una nueva estrategia de marketing basada en los parámetros proporcionados por el usuario. Inicia una tarea asíncrona en el backend que interactúa con el modelo de IA.
Parámetros:
- strategyInput (
- object, body, requerido): Objeto JSON que contiene todos los datos del formulario del wizard, como tipo de estrategia, objetivos, audiencia, presupuesto, etc.
Respuesta:
Tipo: object
Estructura: Devuelve el objeto de la estrategia generada, incluyendo el output de la IA y un ID único.
```json
{
  "id": "strat_1a2b3c4d5e",
  "trainerId": "user_f6g7h8i9j0",
  "createdAt": "2023-10-27T10:00:00Z",
  "type": "content_plan_30_days",
  "status": "completed",
  "output": {
    "summary": "Plan de contenido para Instagram enfocado en 'fat loss' para profesionales ocupados.",
    "week1": [
      {
        "day": "Monday",
        "topic": "Myth-busting Mondays: 'Cardio is the only way to lose fat'",
        "format": "Carousel Post"
      },
      {
        "day": "Wednesday",
        "topic": "15-min HIIT workout you can do at home",
        "format": "Reel"
      }
    ]
  }
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Los datos de entrada son inválidos o incompletos.
- 429: 
- Too Many Requests - El usuario ha excedido su cuota de generaciones de estrategias para su plan de suscripción.
- 503: 
- Service Unavailable - El servicio de IA no está disponible en este momento.

### 2. GET /api/marketing/ai/strategies
Obtiene una lista paginada de todas las estrategias de marketing generadas y guardadas previamente por el usuario autenticado.
Parámetros:
- page (
- number, query, opcional): Número de la página a obtener.
- limit (
- number, query, opcional): Número de estrategias por página.
Respuesta:
Tipo: array
Estructura: Un array de objetos de estrategia (versión resumida, sin el 'output' completo).
```json
[
  {
    "id": "strat_1a2b3c4d5e",
    "createdAt": "2023-10-27T10:00:00Z",
    "type": "content_plan_30_days",
    "title": "Plan de Contenido - Octubre 2023"
  }
]
```
Autenticación: Requerida

### 3. GET /api/marketing/ai/strategies/{strategyId}
Obtiene los detalles completos de una estrategia específica por su ID.
Parámetros:
- strategyId (
- string, path, requerido): El ID único de la estrategia a obtener.
Respuesta:
Tipo: object
Estructura: El objeto completo de la estrategia, incluyendo los inputs originales y el output detallado de la IA.
```json
Ver ejemplo de respuesta del endpoint POST.
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - La estrategia con el ID especificado no existe o no pertenece al usuario.

### 4. DELETE /api/marketing/ai/strategies/{strategyId}
Elimina una estrategia guardada.
Parámetros:
- strategyId (
- string, path, requerido): El ID único de la estrategia a eliminar.
Respuesta:
Tipo: object
Estructura: Respuesta vacía con código de estado 204 No Content en caso de éxito.
```json
{}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - La estrategia con el ID especificado no existe o no pertenece al usuario.
## Notas Técnicas
Colecciones backend: users (para obtener el perfil del entrenador, su nicho y experiencia), ai_strategies (para almacenar las estrategias generadas, sus inputs y outputs), clients (para análisis anonimizado de demografía y comportamiento para refinar las sugerencias de la IA), services (para entender los productos/servicios que vende el entrenador y adaptar las campañas)
KPIs visibles: Número de estrategias generadas por mes., Tasa de 'adopción' de estrategias (porcentaje de estrategias guardadas vs. generadas)., Calificación promedio de la utilidad de la estrategia (feedback del usuario post-generación, 1-5 estrellas)., Tipo de estrategia más generada (ej. 'Plan de Contenido' es el 60% de las generaciones)., Tiempo promedio de generación por estrategia (para monitorear el rendimiento técnico).
## Documentación Completa
## Resumen
El **Generador de Estrategias de Marketing con IA** es una funcionalidad premium dentro de TrainerERP, diseñada para actuar como un consultor de marketing personal para los entrenadores. Su propósito es traducir los objetivos de negocio de un entrenador en planes de marketing accionables y personalizados. En un mercado altamente competitivo, los entrenadores personales necesitan más que excelentes habilidades de entrenamiento; necesitan ser marketeros eficientes. Esta herramienta aborda directamente esa necesidad, utilizando inteligencia artificial para crear estrategias sofisticadas sin requerir conocimientos previos de marketing por parte del usuario.
El sistema guía al entrenador a través de una serie de preguntas para recopilar información crucial sobre su nicho (ej. 'fitness para embarazadas'), su cliente ideal, sus objetivos específicos (ej. 'lanzar un reto de 21 días'), presupuesto y canales preferidos. Con estos datos, la IA genera planes detallados que pueden incluir:
* **Planes de Contenido:** Calendarios de publicación para 30, 60 o 90 días con temas, formatos (Reel, Carrusel, Story) y borradores de texto.
* **Estrategias de Campaña:** Planes completos para lanzamientos de productos, promociones estacionales o eventos, cubriendo desde la captación de leads hasta la conversión.
* **Estrategias de Retención:** Tácticas y comunicaciones específicas para mantener a los clientes actuales comprometidos y reducir el abandono.
* **Ideas de Colaboración:** Sugerencias de partnerships con otros profesionales (nutricionistas, fisioterapeutas, tiendas de suplementos) para expandir el alcance.
## Flujo paso a paso de uso real
Imaginemos a **Carlos**, un entrenador personal online cuyo nicho es ayudar a profesionales de oficina a combatir el sedentarismo.
1. **Acceso y Selección:** Carlos accede a la sección de Marketing en su dashboard de TrainerERP y selecciona 'Generador de Estrategias con IA'. En la pantalla inicial, elige la opción 'Crear un plan de contenido para redes sociales'.
2. **Definición de Objetivos (Paso 1):** El asistente le pregunta cuál es su objetivo principal. Carlos selecciona 'Aumentar el engagement y atraer nuevos leads'. Se le pide que defina su objetivo para los próximos 30 días: 'Conseguir 15 nuevas consultas gratuitas'.
3. **Descripción de la Audiencia (Paso 2):** El sistema le pide que describa a su cliente ideal. Carlos escribe: 'Hombres y mujeres entre 30 y 45 años que trabajan en oficinas, pasan más de 8 horas sentados y sufren de dolores de espalda leves. Valoran la eficiencia y necesitan rutinas cortas y efectivas'.
4. **Canales y Tono (Paso 3):** Carlos indica que su canal principal es Instagram, y su tono de comunicación es 'educativo, profesional pero cercano'.
5. **Generación:** Carlos revisa el resumen de su solicitud y hace clic en 'Generar Estrategia'. Una animación de carga le indica que la IA está trabajando.
6. **Visualización y Acción:** En menos de un minuto, el sistema presenta un plan de contenido de 30 días estructurado por semanas. Por ejemplo:
* **Semana 1: Concienciación del Problema**
* **Lunes (Carrusel):** 'Los 5 peligros ocultos de tu silla de oficina'.
* **Miércoles (Reel):** 'Estiramiento de 30 segundos para tu espalda que puedes hacer sin levantarte'.
* **Viernes (Story con encuesta):** '¿Cuántas horas pasas sentado al día?'
* Cada idea de contenido viene con un borrador de copy y sugerencias de hashtags relevantes como `#saludcorporativa` o `#adiosdolordeespalda`.
7. **Guardado e Integración:** A Carlos le encanta el plan. Lo guarda con el nombre 'Plan de Contenido - Diciembre'. Luego, utiliza el botón 'Añadir al Calendario' para que las tareas de publicación aparezcan directamente en su planificador de contenidos de TrainerERP, listas para ser programadas.
## Riesgos operativos y edge cases
* **Dependencia de servicios externos (LLM):** Si la API del proveedor de IA (ej. OpenAI) sufre una interrupción, la funcionalidad quedará inoperativa. Se deben implementar mecanismos de 'circuit breaker' y mostrar mensajes de error claros al usuario. El sistema debe tener un estado de mantenimiento para estas situaciones.
* **Calidad del Input:** Un input vago como 'quiero más clientes' producirá un output genérico. La UI debe usar placeholders, ejemplos y tooltips para forzar al usuario a ser específico. Podríamos implementar un 'verificador de calidad de input' antes de enviar la petición a la IA.
* **Contenido Inapropiado o Erróneo:** Aunque los modelos están entrenados para ser seguros, existe un riesgo mínimo de que generen contenido incorrecto o inapropiado. Se debe incluir un disclaimer claro y un mecanismo para que los usuarios reporten resultados de baja calidad, lo que servirá para retroalimentar y mejorar el sistema de prompts.
* **Costos de API:** El uso intensivo puede generar costos elevados. Es crucial implementar un sistema de cuotas ligado a los planes de suscripción de TrainerERP (ej. 5 generaciones/mes en Plan Pro, ilimitado en Plan Elite). Las peticiones deben ser cacheadas cuando sea posible.
* **Lentitud en la Generación:** Las llamadas a modelos de IA potentes pueden tardar. La UI debe ser asíncrona, permitiendo al usuario navegar a otras partes de la app mientras la estrategia se genera en segundo plano y notificarle cuando esté lista.
## KPIs y qué significan
* **Tasa de Adopción de Estrategias:** (Estrategias Guardadas / Estrategias Generadas). Este es el KPI más importante. Mide si los usuarios consideran que el resultado es lo suficientemente bueno como para guardarlo y, presumiblemente, actuar sobre él. Una tasa baja indica problemas con la calidad o relevancia del output de la IA.
* **Tasa de finalización del Wizard:** (Usuarios que finalizan el wizard / Usuarios que inician el wizard). Mide la usabilidad del formulario de entrada. Si muchos usuarios abandonan a mitad de camino, el proceso es demasiado largo, confuso o exigente.
* **Calificación Promedio de Utilidad:** Un sistema de feedback (1 a 5 estrellas) post-generación. Nos da datos cualitativos directos sobre la percepción del valor por parte del usuario. Los comentarios adjuntos a las calificaciones bajas son una mina de oro para la mejora.
* **Engagement con Funciones Post-Generación:** Medir cuántos usuarios utilizan los botones de 'Exportar a PDF', 'Añadir al Calendario', etc. Esto indica que no solo les gusta la estrategia, sino que la están integrando en su flujo de trabajo.
* **Correlación con el Crecimiento del Negocio (Avanzado):** A largo plazo, se puede analizar si los entrenadores que usan activamente esta herramienta muestran un mayor crecimiento en el número de clientes activos o ingresos en comparación con los que no la usan. Este es el indicador definitivo del ROI de la funcionalidad.
## Diagramas de Flujo (Mermaid)
mermaid
sequenceDiagram
participant User as Entrenador
participant FE as Frontend (React App)
participant BE as Backend (TrainerERP API)
participant AI as Servicio de IA (LLM API)
User->>FE: Inicia la creación de una nueva estrategia
FE->>User: Muestra el asistente (wizard) de múltiples pasos
User->>FE: Completa los datos del formulario (objetivos, audiencia, etc.)
FE->>BE: POST /api/marketing/ai/strategies con los datos del formulario
BE->>BE: Valida los datos de entrada
alt Datos inválidos
BE-->>FE: Retorna error 400 (Bad Request)
FE-->>User: Muestra mensaje de error
else Datos válidos
BE->>BE: Construye un prompt detallado para la IA
BE->>AI: Envía el prompt a la API de LLM
AI-->>BE: Retorna la estrategia generada en formato JSON/texto
BE->>BE: Procesa la respuesta, la formatea y la guarda en la base de datos
BE-->>FE: Retorna la estrategia guardada con su ID (código 201)
FE->>User: Muestra la estrategia generada en una UI organizada
end
