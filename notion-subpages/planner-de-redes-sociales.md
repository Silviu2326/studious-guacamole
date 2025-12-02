# Planner de Redes Sociales

**Página padre:** Hola

---

# Planner de Redes Sociales
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad es para los entrenadores que gestionan el marketing y la comunicación del negocio. El 'Entrenador Personal (Administrador)' tendrá control total, podrá conectar cuentas, ver el planner de todos los entrenadores y acceder a analíticas globales. El 'Entrenador Asociado' solo podrá crear y programar contenido para las cuentas a las que tenga permiso, y verá únicamente sus propias publicaciones y analíticas.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/marketing/social-planner
## Descripción Funcional
El Planner de Redes Sociales es el centro de mando para la estrategia de marketing digital de cualquier entrenador personal que use TrainerERP. Esta herramienta integrada permite planificar, crear, programar y analizar todo el contenido para plataformas clave como Instagram, Facebook, TikTok y LinkedIn, sin salir del ecosistema de gestión. El núcleo de la página es un calendario visual interactivo donde el entrenador puede ver de un vistazo toda su programación de contenido, arrastrar y soltar publicaciones para reorganizarlas y detectar huecos en su estrategia. El creador de posts está diseñado específicamente para el nicho fitness, ofreciendo plantillas para tipos de contenido recurrente como 'Transformación del Martes', 'Tip de Nutrición', 'Ejercicio de la Semana' o 'Frase Motivacional'. Además, permite subir fácilmente fotos y videos de entrenamientos o testimonios de clientes (con su debido consentimiento). La funcionalidad de programación inteligente sugiere los mejores horarios para publicar basándose en el historial de engagement de la audiencia del entrenador, maximizando así el alcance y la interacción. La sección de analíticas proporciona métricas claras y accionables sobre qué contenido resuena más con la audiencia, ayudando a refinar la estrategia para captar más leads y fortalecer la comunidad online.
## Valor de Negocio
El Planner de Redes Sociales aporta un valor incalculable al negocio de un entrenador personal al transformar una tarea compleja y que consume mucho tiempo en un proceso eficiente y estratégico. En primer lugar, centraliza la gestión de múltiples perfiles sociales, ahorrando horas cada semana que de otro modo se gastarían cambiando entre aplicaciones. Esta eficiencia permite al entrenador dedicar más tiempo a lo que realmente importa: entrenar a sus clientes. En segundo lugar, fomenta una marca personal sólida y consistente. Al planificar el contenido con antelación, el entrenador asegura un flujo constante de publicaciones de alta calidad que refuerzan su autoridad y propuesta de valor. Esto es crucial para atraer y convertir nuevos clientes. Además, la herramienta va más allá de la simple programación; sus analíticas y sugerencias inteligentes convierten los datos en decisiones de negocio. Al entender qué tipo de contenido (videos de ejercicios, testimonios, tips de nutrición) genera más interacción, el entrenador puede optimizar su estrategia para maximizar la captación de leads y la retención de clientes, impactando directamente en la facturación y el crecimiento del negocio.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero conectar mis perfiles de Instagram y Facebook a TrainerERP para poder gestionar todo mi contenido desde un único calendario.
- Como coach online, quiero crear y programar con una semana de antelación mis posts, incluyendo videos de ejercicios y fotos de progreso de clientes, para mantener mi perfil activo sin tener que publicar manualmente cada día.
- Como dueño de un estudio de entrenamiento, quiero revisar y aprobar las publicaciones programadas por mis entrenadores asociados antes de que se publiquen, para asegurar la consistencia de la marca.
- Como entrenador independiente, quiero recibir sugerencias de los mejores horarios para publicar en TikTok para que mis videos de retos fitness lleguen a la mayor audiencia posible.
- Como coach de nutrición, quiero ver un panel de análisis que me muestre qué tipo de recetas o tips de alimentación tienen más 'guardados' y 'compartidos' para crear más contenido de valor similar.
## Acciones Clave
- Conectar una nueva cuenta de red social (Instagram, Facebook, etc.) a través de un flujo OAuth.
- Crear una nueva publicación (texto, imagen/video, hashtags) y asignarla a una o varias cuentas.
- Programar una publicación para una fecha y hora específicas o añadirla a una cola de publicación automática.
- Visualizar todas las publicaciones (borradores, programadas, publicadas) en una vista de calendario mensual/semanal.
- Arrastrar y soltar una publicación programada en el calendario para cambiar su fecha/hora.
- Acceder a un panel de analíticas para medir el rendimiento del contenido (engagement, alcance, clics).
- Utilizar una biblioteca de plantillas de contenido específicas para entrenadores (e.g., 'Antes y Después', 'Mito Fitness').
## 🧩 Componentes React Sugeridos
### 1. SocialPlannerCalendar
Tipo: container | Renderiza el calendario principal. Obtiene los posts del mes/semana a través de una API y los muestra. Maneja la lógica de arrastrar y soltar para reprogramar publicaciones y el click para abrir el modal de creación/edición.
Props:
- currentDate: 
- Date (requerido) - La fecha inicial que debe mostrar el calendario.
- onPostSelect: 
- (postId: string | null) => void (requerido) - Callback que se ejecuta al hacer clic en un post existente o en un día vacío para crear uno nuevo.
Estados: isLoadingPosts, posts, viewMode ('month' | 'week')
Dependencias: react-big-calendar, react-dnd
Ejemplo de uso:
```typescript
<SocialPlannerCalendar currentDate={new Date()} onPostSelect={handleOpenPostModal} />
```

### 2. PostCreatorModal
Tipo: container | Un modal para crear o editar una publicación. Contiene el editor de texto, el uploader de archivos, el selector de perfiles sociales, el programador de fecha/hora y botones de acción (Guardar Borrador, Programar).
Props:
- isOpen: 
- boolean (requerido) - Controla la visibilidad del modal.
- onClose: 
- () => void (requerido) - Función para cerrar el modal.
- postId: 
- string | null (opcional) - El ID del post a editar. Si es null, se crea uno nuevo.
Estados: postContent, selectedAccounts, scheduledDateTime, uploadedMedia, isSubmitting
Dependencias: react-modal, react-datetime-picker, react-dropzone
Ejemplo de uso:
```typescript
<PostCreatorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} postId={selectedPostId} />
```

### 3. PostCard
Tipo: presentational | Componente visual que representa una publicación dentro del calendario. Muestra una vista previa en miniatura de la imagen/video, el icono de la red social y un indicador de estado (e.g., un punto de color para 'programado', 'publicado', 'error').
Props:
- post: 
- { id: string; previewUrl: string; platform: 'instagram' | 'facebook'; status: 'scheduled' | 'published' | 'failed'; content: string; } (requerido) - El objeto de datos de la publicación a renderizar.
Ejemplo de uso:
```typescript
<PostCard post={postData} />
```

### 4. useSocialAnalytics
Tipo: hook | Hook personalizado para obtener y gestionar los datos de analíticas. Maneja el estado de carga, los datos y los posibles errores. Permite filtrar por rango de fechas y por plataforma.
Props:
- dateRange: 
- { startDate: Date; endDate: Date; } (requerido) - El rango de fechas para el cual obtener las analíticas.
Estados: analyticsData, isLoading, error
Dependencias: axios, swr
Ejemplo de uso:
```typescript
const { data, isLoading } = useSocialAnalytics({ startDate, endDate });
```
## 🔌 APIs Requeridas
### 1. GET /api/v1/social/posts
Obtiene una lista de publicaciones para un rango de fechas y perfiles sociales específicos, para ser mostradas en el calendario.
Parámetros:
- startDate (
- string (ISO 8601), query, requerido): Fecha de inicio del rango de búsqueda.
- endDate (
- string (ISO 8601), query, requerido): Fecha de fin del rango de búsqueda.
- profileIds (
- string (separado por comas), query, opcional): IDs de los perfiles sociales a filtrar.
Respuesta:
Tipo: array
Estructura: Array de objetos Post, cada uno con id, content, status, scheduledAt, platform, mediaUrls.
```json
[
  {
    "id": "post_123",
    "content": "¡Empezamos la semana con energía! ¿Quién se apunta a un reto de 30 días? #fitness #personaltrainer",
    "status": "scheduled",
    "scheduledAt": "2024-10-28T09:00:00.000Z",
    "platform": "instagram",
    "mediaUrls": [
      "https://cdn.trainererp.com/media/xyz.jpg"
    ]
  }
]
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Parámetros de fecha inválidos.
- 401: 
- Unauthorized - Token de autenticación inválido o ausente.

### 2. POST /api/v1/social/posts
Crea una nueva publicación. Puede ser guardada como borrador o programada para una fecha futura.
Parámetros:
- postData (
- object, body, requerido): Objeto con el contenido del post.
Respuesta:
Tipo: object
Estructura: El objeto del Post recién creado.
```json
{
  "id": "post_124",
  "content": "Tip de nutrición: ¡No le temas a los carbohidratos! Son tu principal fuente de energía.",
  "status": "scheduled",
  "scheduledAt": "2024-10-29T12:00:00.000Z",
  "profileId": "profile_abc",
  "platform": "facebook",
  "mediaAssetIds": [
    "asset_456"
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Faltan campos requeridos como 'content' o 'profileId'.
- 422: 
- Unprocessable Entity - La fecha de programación está en el pasado.

### 3. PUT /api/v1/social/posts/{postId}
Actualiza una publicación existente, típicamente para cambiar su contenido o reprogramarla. Solo se pueden editar posts en estado 'draft' o 'scheduled'.
Parámetros:
- postId (
- string, path, requerido): El ID de la publicación a actualizar.
- updateData (
- object, body, requerido): Objeto con los campos a actualizar (content, scheduledAt, etc.).
Respuesta:
Tipo: object
Estructura: El objeto del Post actualizado.
```json
{
  "id": "post_123",
  "content": "¡Recordatorio! Mañana empieza nuestro reto de 30 días. ¡Únete ahora!",
  "status": "scheduled",
  "scheduledAt": "2024-10-28T10:00:00.000Z",
  "platform": "instagram"
}
```
Autenticación: Requerida
Errores posibles:
- 403: 
- Forbidden - El usuario no tiene permisos para editar este post.
- 404: 
- Not Found - El postId no existe.
- 409: 
- Conflict - Intento de editar un post que ya ha sido publicado.

### 4. GET /api/v1/social/analytics
Obtiene datos de rendimiento agregados para las publicaciones en un rango de fechas, como engagement, alcance y crecimiento de seguidores.
Parámetros:
- startDate (
- string (ISO 8601), query, requerido): Fecha de inicio del rango de análisis.
- endDate (
- string (ISO 8601), query, requerido): Fecha de fin del rango de análisis.
Respuesta:
Tipo: object
Estructura: Un objeto con KPIs agregados y un desglose de los posts con mejor rendimiento.
```json
{
  "summary": {
    "totalReach": 15230,
    "totalImpressions": 25400,
    "engagementRate": "4.5%",
    "followerGrowth": 89,
    "linkClicks": 120
  },
  "topPosts": [
    {
      "id": "post_098",
      "content": "Transformación increíble de nuestro cliente @JuanPerez...",
      "engagement": 1200,
      "reach": 8500
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 503: 
- Service Unavailable - No se pudo obtener datos de la API externa de la red social.
## Notas Técnicas
Colecciones backend: SocialProfiles, SocialPosts, MediaAssets, PostTemplates, SocialAnalyticsSnapshots
KPIs visibles: Tasa de Engagement (por post y promedio), Alcance e Impresiones totales, Crecimiento de Seguidores (atribuido), Clics en el Enlace (e.g., link en bio), Posts con Mejor Rendimiento (Top 5 por engagement), Frecuencia de Publicación (posts por semana)
## Documentación Completa
## Resumen
El Planner de Redes Sociales es una herramienta integral dentro de TrainerERP, diseñada para empoderar a los entrenadores personales en su estrategia de marketing digital. Su objetivo principal es simplificar y centralizar la creación, programación y análisis de contenido para las principales plataformas sociales (Instagram, Facebook, TikTok, LinkedIn). Al integrar esta funcionalidad directamente en el ERP, se crea un flujo de trabajo unificado donde el marketing de contenidos se conecta con la gestión de clientes y el crecimiento del negocio. Los entrenadores pueden pasar de una gestión de redes caótica y reactiva a una estrategia planificada y proactiva, asegurando una presencia online consistente y profesional que atraiga a nuevos clientes y fidelice a los existentes. La herramienta no solo es un programador, sino un asistente inteligente que ofrece plantillas de contenido específicas para el nicho fitness, sugiere los mejores horarios de publicación basados en datos y proporciona analíticas claras para optimizar la estrategia continuamente.
## Flujo paso a paso de uso real
Imaginemos a **Laura, una entrenadora personal online** que quiere planificar su contenido para la próxima semana.
1. **Conexión Inicial**: El lunes por la mañana, Laura entra por primera vez al Planner. La pantalla de bienvenida la guía para conectar sus cuentas. Hace clic en 'Conectar Instagram', es redirigida a una ventana de autenticación de Instagram (OAuth), aprueba los permisos y su cuenta aparece en TrainerERP. Repite el proceso para su página de Facebook.
2. **Planificación Visual**: Una vez conectada, ve un calendario semanal. Decide planificar un post para cada día. Hace clic en el recuadro del martes y se abre el `PostCreatorModal`.
3. **Creación de Contenido de Valor**: Para el martes, quiere publicar una foto de 'antes y después' de un cliente. Selecciona la plantilla 'Transformación'. Esto precarga un texto sugerido: `¡Increíble transformación de [Nombre del Cliente]! Con dedicación y constancia, hemos logrado [Resultado]. ¡Felicidades! #Transformacion #FitnessMotivation`. Laura personaliza el texto, menciona a su cliente (con su permiso) y sube las dos fotos desde su ordenador. Selecciona que se publique en Instagram y Facebook.
4. **Programación Inteligente**: En lugar de elegir una hora al azar, Laura hace clic en 'Sugerir mejor horario'. El sistema, basándose en el engagement pasado de su audiencia, sugiere 'Martes a las 18:30'. Laura acepta y hace clic en 'Programar'. El post aparece en el calendario del martes.
5. **Contenido en Lote**: Para el resto de la semana, crea rápidamente un video corto con un 'Tip de Ejercicio' para el jueves, una receta saludable para el sábado y una frase motivacional para el domingo por la tarde. Usa la función de arrastrar y soltar para mover el post del sábado al viernes, ya que le parece mejor día.
6. **Análisis y Optimización**: Al final de la semana, Laura vuelve al Planner y cambia a la vista de 'Analíticas'. Ve que el post de transformación del martes tuvo el mayor alcance y engagement. El video del tip de ejercicio, aunque con menos alcance, generó muchos 'guardados'. Con esta información, decide que la próxima semana hará dos posts de transformación y creará más videos con tips prácticos.
## Riesgos operativos y edge cases
- **Desincronización de API Tokens**: El riesgo más común. Si un usuario cambia su contraseña de Facebook, el token se invalidará. El sistema debe detectar el token inválido (error 401 de la API externa), marcar el perfil social como 'desconectado' en la UI y enviar una notificación (in-app y por email) al usuario para que vuelva a conectar su cuenta. Los posts programados para esa cuenta deben pausarse y marcarse con un estado de 'error de autenticación'.
- **Fallo en la Publicación**: Un post puede fallar por múltiples razones (video demasiado largo, texto que viola políticas, API de la plataforma caída). El sistema debe tener un mecanismo de reintentos (ej. 3 intentos con espera exponencial). Si falla definitivamente, el post se marca como 'fallido' en el calendario y se notifica al usuario con el mensaje de error devuelto por la API para que pueda corregirlo.
- **Gestión de Zonas Horarias**: La programación debe ser infalible. Todas las fechas deben guardarse en el backend en UTC. La UI debe mostrar las horas en la zona horaria local del navegador del usuario, indicándolo claramente (ej. 'Programado para las 10:00 AM - GMT-5').
- **Cambios en las APIs Externas**: Facebook, Instagram, etc., cambian sus APIs constantemente. Esto puede romper la funcionalidad. Se requiere un monitoreo constante de la documentación para desarrolladores de estas plataformas y un equipo ágil para adaptar el código cuando ocurran cambios 'breaking'.
## KPIs y qué significan
- **Tasa de Engagement**: (Likes + Comentarios + Guardados + Compartidos) / Alcance. Es el KPI más importante. Para un entrenador, una alta tasa significa que su contenido resuena, educa o inspira a su audiencia, lo que construye confianza y comunidad. Un post de 'antes y después' con alto engagement es una poderosa herramienta de venta.
- **Alcance e Impresiones**: El alcance es el número de usuarios únicos que vieron el post; las impresiones son el total de veces que se vio. Un alto alcance indica que el contenido se está distribuyendo bien (buenos hashtags, buen horario). Es clave para la captación de nuevos seguidores y potenciales clientes.
- **Crecimiento de Seguidores**: Mide cuántos nuevos seguidores ha ganado la cuenta en el periodo seleccionado. Aunque es una métrica de vanidad, un crecimiento constante indica una estrategia de contenido saludable que atrae al público objetivo.
- **Clics en el Enlace**: Mide cuántas veces los usuarios hicieron clic en el enlace del perfil (ej. link a la landing page de TrainerERP para reservar una sesión). Este es un KPI de conversión directa que mide cuántas personas pasan de ser audiencia a ser un lead potencial.
- **Posts con Mejor Rendimiento**: Identificar qué publicaciones específicas generan los mejores resultados permite al entrenador replicar el éxito. Si los videos de 'cómo hacer un ejercicio' son siempre los de mayor rendimiento, es una señal clara para producir más de ese tipo de contenido.
## Diagramas de Flujo (Mermaid)
**Flujo de Creación y Programación de un Post:**
mermaid
graph TD
A[Usuario hace clic en 'Crear Post' en el calendario] --> B(Se abre el PostCreatorModal);
B --> C{Elige plantilla o empieza de cero};
C --> D[Escribe el texto y añade hashtags];
D --> E[Sube imagen/video];
E --> F[Selecciona perfiles (Instagram, Facebook)];
F --> G[Elige fecha y hora de publicación];
G --> H{¿Programar ahora?};
H -- Sí --> I[POST /api/v1/social/posts];
I -- Éxito 201 --> J[Post aparece en el calendario con estado 'Programado'];
I -- Error 4xx --> K[Muestra mensaje de error en el modal];
H -- No, guardar borrador --> L[Guarda el post con estado 'Borrador'];
J --> M[Cierra el modal y actualiza la UI];
L --> M;
