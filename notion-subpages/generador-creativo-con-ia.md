# Generador Creativo con IA

**Página padre:** Hola

---

# Generador Creativo con IA
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta herramienta está diseñada para los profesionales que gestionan el marketing y la comunicación del negocio. El 'Entrenador Personal (Administrador)' tendrá acceso completo para crear contenido y definir la voz de la marca. El 'Entrenador Asociado' podrá generar contenido, pero podría tener restricciones para modificar la configuración de la marca global del estudio, dependiendo de sus permisos.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/marketing/ia-generator
## Descripción Funcional
El 'Generador Creativo con IA' es un asistente de marketing inteligente integrado en TrainerERP, diseñado para eliminar el bloqueo del escritor y potenciar la creatividad de los entrenadores personales. Esta herramienta utiliza modelos avanzados de inteligencia artificial para generar textos de alta calidad y específicos para el nicho del fitness, ahorrando horas de trabajo cada semana. Los entrenadores pueden generar una amplia variedad de contenidos: desde captions motivacionales para posts de Instagram que celebren la transformación de un cliente, hasta descripciones de venta persuasivas para un nuevo programa de entrenamiento online. Permite crear secuencias de emails para nutrir leads, guiones para vídeos cortos (Reels/TikToks), ideas para blogs sobre nutrición y bienestar, y textos para campañas de retos de 30 días. La característica más potente es su capacidad de personalización. El entrenador puede configurar su 'Perfil de Marca', definiendo su tono de voz (ej: 'científico y basado en evidencia', 'enérgico y motivador', 'cercano y empático'), su público objetivo y sus servicios clave. La IA utiliza este perfil para asegurar que cada pieza de contenido generado sea coherente y auténtica, fortaleciendo la marca personal del entrenador en cada interacción.
## Valor de Negocio
El valor principal del 'Generador Creativo con IA' reside en la optimización radical del tiempo y la mejora de la calidad del marketing para los entrenadores. La creación de contenido es una de las tareas más consumidoras de tiempo y a menudo una barrera para el crecimiento del negocio. Al automatizar la ideación y redacción inicial, TrainerERP libera a los entrenadores para que se centren en lo que mejor saben hacer: entrenar a sus clientes. Esto se traduce directamente en una mayor productividad y rentabilidad. Además, democratiza el acceso a un marketing de alta calidad. No todos los entrenadores son copywriters expertos; esta herramienta les proporciona textos persuasivos y optimizados para la conversión, mejorando la captación de leads y las ventas de programas. Al mantener una voz de marca consistente a través de todos los canales, se construye una marca más fuerte y reconocible, lo que aumenta la confianza y la retención de clientes. En última instancia, esta funcionalidad transforma a TrainerERP de un simple sistema de gestión a un verdadero socio de crecimiento para el negocio del entrenador, ofreciendo una ventaja competitiva significativa en un mercado saturado.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: media
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador online, quiero generar 5 ideas diferentes para un Reel de Instagram sobre 'errores comunes al hacer sentadillas', para poder crear contenido educativo y atractivo rápidamente.
- Como dueño de un estudio de fitness, quiero redactar un email promocional para anunciar una nueva 'Membresía Premium' que incluye sesiones de nutrición, para poder comunicarlo a mi base de datos y aumentar las ventas.
- Como entrenador personal independiente, quiero definir mi tono de voz como 'directo y sin rodeos' para que toda la comunicación generada por la IA refleje mi marca personal y conecte con mi cliente ideal.
- Como coach de grupos pequeños, quiero crear una descripción atractiva para un nuevo 'Reto de 6 semanas de transformación corporal', para publicarla en mi landing page y maximizar las inscripciones.
- Como un entrenador ocupado, quiero seleccionar una plantilla de 'Post de celebración de progreso del cliente', introducir el nombre del cliente y sus logros, y obtener un texto inspirador para compartir en mis redes sociales, ahorrando tiempo y motivando a mi comunidad.
- Como especialista en entrenamiento funcional, quiero generar un esquema para un artículo de blog titulado '5 beneficios del entrenamiento funcional para oficinistas', para mejorar el SEO de mi web y atraer tráfico cualificado.
## Acciones Clave
- Seleccionar una plantilla de generación de contenido (ej: Post para Instagram, Email de Venta, Idea de Blog).
- Introducir un prompt o tema principal para la generación.
- Ajustar parámetros avanzados: tono de voz, público objetivo, llamada a la acción, longitud del texto.
- Ejecutar la generación para obtener múltiples variantes de texto.
- Editar, refinar y guardar el resultado preferido en una biblioteca de contenidos.
- Copiar el texto generado para usarlo en otras plataformas.
- Consultar el historial de generaciones anteriores para reutilizar ideas.
## 🧩 Componentes React Sugeridos
### 1. AIGeneratorView
Tipo: container | Componente principal que orquesta toda la página. Gestiona el estado global, las llamadas a la API a través de hooks y renderiza los componentes de UI.
Estados: isLoading, error, generatedResults[], currentPrompt, generationSettings{}
Dependencias: useAIGeneration (custom hook)
Ejemplo de uso:
```typescript
<AIGeneratorView />
```

### 2. GenerationForm
Tipo: presentational | Formulario donde el entrenador introduce su idea y selecciona las opciones de generación. Es un componente controlado que emite eventos al contenedor padre.
Props:
- templates: 
- Array<{id: string, name: string, description: string}> (requerido) - Lista de plantillas de contenido disponibles (Post, Email, etc).
- brandProfile: 
- Object (opcional) - Objeto con el perfil de marca del entrenador para preseleccionar el tono.
- onSubmit: 
- (data: {prompt: string, settings: object}) => void (requerido) - Función callback que se ejecuta al enviar el formulario.
- isGenerating: 
- boolean (requerido) - Indica si una generación está en curso, para deshabilitar el botón.
Estados: formData
Dependencias: react-hook-form, zod
Ejemplo de uso:
```typescript
<GenerationForm templates={templates} brandProfile={profile} onSubmit={handleGenerate} isGenerating={isLoading} />
```

### 3. ResultCard
Tipo: presentational | Muestra un único resultado de la generación de IA. Incluye el texto generado y botones de acción (copiar, guardar, descartar).
Props:
- content: 
- string (requerido) - El texto generado por la IA.
- onCopy: 
- () => void (requerido) - Función para copiar el contenido al portapapeles.
- onSave: 
- () => void (requerido) - Función para marcar el contenido como guardado.
Estados: isCopied
Dependencias: clipboard-copy
Ejemplo de uso:
```typescript
<ResultCard content={'Un gran post...'} onCopy={handleCopy} onSave={handleSave} />
```

### 4. useAIGeneration
Tipo: hook | Hook personalizado que encapsula la lógica para interactuar con el endpoint de generación de la API. Maneja los estados de carga, error y datos.
Estados: data, error, isLoading
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
const { mutate: generateContent, isLoading, data } = useAIGeneration();
```
## 🔌 APIs Requeridas
### 1. POST /api/v1/ai-generator/generate
Genera contenido de texto basado en un prompt, una plantilla y ajustes de personalización. Consume tokens del plan del usuario.
Parámetros:
- templateId (
- string, body, requerido): ID de la plantilla de contenido (ej: 'instagram_post', 'sales_email').
- prompt (
- string, body, requerido): La idea o tema principal proporcionado por el usuario.
- settings (
- object, body, opcional): Objeto con configuraciones opcionales como 'tone', 'length', 'language'.
Respuesta:
Tipo: object
Estructura: Un objeto que contiene un array de resultados generados.
```json
{
  "generationId": "gen_a1b2c3d4",
  "results": [
    {
      "id": "res_001",
      "text": "¡Transforma tu cuerpo y mente con nuestro nuevo programa! 🔥 ¿Listo para el desafío? #fitness #entrenadorpersonal"
    },
    {
      "id": "res_002",
      "text": "Deja de posponer tus metas. Nuestro programa de entrenamiento está diseñado para darte resultados reales. ¡Inscríbete hoy! 💪 #transformacion"
    }
  ],
  "tokensUsed": 150
}
```
Autenticación: Requerida
Errores posibles:
- 402: 
- Payment Required - El usuario ha excedido el límite de generaciones de su plan actual.
- 429: 
- Too Many Requests - El usuario está haciendo demasiadas peticiones en un corto período de tiempo (rate limiting).
- 503: 
- Service Unavailable - El proveedor de IA externo no está disponible.

### 2. GET /api/v1/ai-generator/history
Recupera el historial de generaciones de contenido para el entrenador autenticado, con paginación.
Parámetros:
- page (
- number, query, opcional): Número de la página de resultados.
- limit (
- number, query, opcional): Número de resultados por página.
Respuesta:
Tipo: object
Estructura: Un objeto con metadatos de paginación y un array de generaciones históricas.
```json
{
  "page": 1,
  "totalPages": 5,
  "totalResults": 50,
  "results": [
    {
      "generationId": "gen_a1b2c3d4",
      "prompt": "Post sobre beneficios de la creatina",
      "createdAt": "2023-10-27T10:00:00Z",
      "savedResult": "La creatina es uno de los suplementos más estudiados y efectivos..."
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación no es válido o ha expirado.

### 3. PUT /api/v1/ai-generator/brand-profile
Crea o actualiza el perfil de marca del entrenador, que la IA utilizará para personalizar las generaciones.
Parámetros:
- toneOfVoice (
- string, body, requerido): Descripción del tono de voz deseado. Ej: 'Motivacional, enérgico y directo'.
- targetAudience (
- string, body, opcional): Descripción del cliente ideal. Ej: 'Mujeres de 30-45 años que quieren recuperar su forma física después del embarazo'.
- keywords (
- string[], body, opcional): Lista de palabras clave o hashtags a incluir.
Respuesta:
Tipo: object
Estructura: El objeto del perfil de marca actualizado.
```json
{
  "trainerId": "user_123",
  "toneOfVoice": "Motivacional, enérgico y directo",
  "targetAudience": "Mujeres de 30-45 años que quieren recuperar su forma física después del embarazo",
  "updatedAt": "2023-10-27T10:05:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Los datos del body no superan la validación (ej: 'toneOfVoice' está vacío).
## Notas Técnicas
Colecciones backend: ia_generations, brand_profiles, content_templates
KPIs visibles: Generaciones realizadas este mes / Límite del plan, Tasa de adopción de la funcionalidad (usuarios activos / total de usuarios), Distribución de uso por tipo de contenido (ej: 45% Instagram, 25% Email, etc.), Ratio de contenido guardado (indica la calidad de las generaciones), Tiempo estimado ahorrado (cálculo basado en el número de generaciones), Plantillas de contenido más utilizadas
## Documentación Completa
## Resumen
El **Generador Creativo con IA** es una funcionalidad estratégica dentro del área de **CONTENIDO & REDES SOCIALES** de TrainerERP. Su objetivo principal es resolver uno de los mayores desafíos para los entrenadores personales: la creación constante de contenido de marketing de alta calidad. Esta herramienta actúa como un copiloto de marketing, permitiendo a los entrenadores generar textos persuasivos y alineados con su marca para diversas plataformas (Instagram, email, blogs, etc.) con solo proporcionar una idea simple.
El sistema se basa en modelos de lenguaje avanzados, pero su valor real radica en la capa de personalización específica para el nicho del fitness. Los entrenadores pueden definir su 'Perfil de Marca', incluyendo su tono de voz, público objetivo y servicios, para que cada texto generado suene auténtico y personal. Esto no solo ahorra incontables horas de trabajo, sino que también eleva la calidad y la coherencia de su comunicación, lo que resulta en una mayor captación de clientes y una marca más sólida.
## Flujo paso a paso de uso real
Imaginemos a **Carlos**, un entrenador personal especializado en calistenia que usa TrainerERP.
1. **Planificación Semanal:** Es lunes por la mañana y Carlos planifica su contenido. Accede a `Marketing > Generador Creativo con IA` en su dashboard de TrainerERP.
2. **Definir el Objetivo:** Quiere promocionar su nuevo taller online 'Iniciación a la Calistenia'.
3. **Selección de Plantilla:** En la interfaz, ve varias opciones: 'Post de Instagram', 'Email Promocional', 'Idea para Blog', etc. Selecciona 'Post de Instagram'.
4. **Introducción del Prompt:** En el campo principal, escribe: `Crear un post para Instagram que genere intriga sobre mi nuevo taller de iniciación a la calistenia. Mencionar que es ideal para principiantes y que las plazas son limitadas.`
5. **Ajuste de Parámetros:** Carlos ya ha configurado su 'Perfil de Marca' con un tono 'educativo y motivador'. La IA lo usa por defecto. Adicionalmente, añade una llamada a la acción específica: `Pide que comenten 'INFO' para recibir los detalles por mensaje directo.`
6. **Generación:** Hace clic en 'Generar'. En unos segundos, la IA le presenta tres variaciones del texto.
* **Opción 1 (Directa):** '¿Siempre has querido dominar tu propio peso? Mi nuevo taller de iniciación a la calistenia es para ti...'
* **Opción 2 (Pregunta):** '¿Crees que necesitas un gimnasio para estar fuerte? Piénsalo de nuevo. La calistenia te enseña a...'
* **Opción 3 (Inspiradora):** 'Imagina la libertad de poder entrenar en cualquier lugar. Esa es la promesa de la calistenia...'
7. **Refinamiento y Uso:** A Carlos le encanta la Opción 2. La copia a su portapapeles con un solo clic. Pega el texto en el planificador de redes sociales de TrainerERP (otra funcionalidad), le añade una imagen y programa su publicación para el martes a las 18:00.
8. **Reutilización:** Más tarde esa semana, vuelve al generador, selecciona la plantilla 'Email Promocional' y usa un prompt similar. La IA, recordando el contexto, genera un texto más largo y detallado perfecto para su lista de correo, explicando los módulos del taller y el precio. El proceso le ha llevado menos de 10 minutos, en lugar de una hora.
## Riesgos operativos y edge cases
* **Calidad y Precisión:** La IA puede 'alucinar' o generar información incorrecta (ej: consejos de nutrición no válidos). **Mitigación:** Incluir un disclaimer claro en la UI: 'El contenido generado por IA debe ser revisado por un profesional antes de su publicación'. Promover la herramienta como un 'primer borrador', no como una solución final.
* **Abuso de la API y Costes:** Un usuario podría crear un script para hacer miles de generaciones, disparando nuestros costes con el proveedor de IA. **Mitigación:** Implementar un sistema de rate limiting estricto por usuario y establecer límites de generaciones mensuales claros y visibles según el plan de suscripción de TrainerERP.
* **Contenido Inapropiado:** Los usuarios podrían intentar generar contenido ofensivo o peligroso. **Mitigación:** Utilizar los filtros de contenido del proveedor de la API (ej: OpenAI Moderation API) y registrar los prompts para auditorías. Implementar un sistema de baneo para usuarios que abusen del servicio.
* **Dependencia del Proveedor:** Si la API del proveedor de IA (ej: OpenAI) se cae, nuestra funcionalidad deja de operar. **Mitigación:** Implementar un sistema de caché para prompts comunes. Diseñar una UI que gestione el estado de error de forma elegante, informando al usuario y sugiriendo que lo intente más tarde. Investigar proveedores alternativos como plan de contingencia.
* **Pérdida de Autenticidad:** Si todos los entrenadores usan la misma herramienta, el contenido puede volverse genérico. **Mitigación:** Poner un fuerte énfasis en la configuración del 'Perfil de Marca'. Animar a los usuarios a editar y añadir su toque personal a cada generación, usando la IA como un punto de partida.
## KPIs y qué significan
1. **Número de Generaciones por Usuario Activo:** Mide la frecuencia de uso. Un número alto indica que la herramienta es valiosa y se ha integrado en el flujo de trabajo del entrenador.
2. **Tasa de Adopción (Usuarios que usan la IA / Usuarios Activos Totales):** Indica el alcance de la funcionalidad. Una baja tasa puede señalar problemas de visibilidad, usabilidad o falta de percepción de valor.
3. **Distribución de Uso por Plantilla:** Nos dice qué tipos de contenido son más demandados (¿Instagram? ¿Emails?). Esto guía el desarrollo futuro de nuevas plantillas y funcionalidades.
4. **Ratio de Contenido Guardado vs. Generado:** KPI clave para medir la calidad y relevancia de los resultados. Un ratio bajo (<30%) es una señal de alerta de que los prompts o el modelo subyacente no están funcionando bien.
5. **Churn de Usuarios que NO Usan la IA vs. los que SÍ la usan:** Un KPI de negocio crítico. Nuestra hipótesis es que los usuarios que adoptan esta herramienta percibirán más valor en TrainerERP y tendrán una tasa de abandono menor.
## Diagramas de Flujo (Mermaid)
mermaid
sequenceDiagram
participant User as Entrenador
participant Frontend as UI (React)
participant Backend as API (TrainerERP)
participant AI_Service as Proveedor IA (OpenAI)
User->>Frontend: 1. Rellena el formulario (prompt, plantilla)
Frontend->>Backend: 2. POST /api/v1/ai-generator/generate
Backend->>Backend: 3. Valida request y permisos del usuario
Backend->>Backend: 4. Construye prompt detallado para la IA (incluye perfil de marca)
Backend->>AI_Service: 5. Envía el prompt a la API de la IA
AI_Service-->>Backend: 6. Devuelve el texto generado
Backend->>Backend: 7. Formatea la respuesta y la guarda en historial
Backend->>Backend: 8. Descuenta tokens/créditos del plan del usuario
Backend-->>Frontend: 9. Responde con los resultados generados
Frontend->>User: 10. Muestra las variantes de texto en la UI
