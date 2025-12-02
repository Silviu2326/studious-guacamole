# Video Marketing & Automation

**Página padre:** Hola

---

# Video Marketing & Automation
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado, Administrador del Sistema
Esta funcionalidad está diseñada principalmente para el 'Entrenador Personal (Administrador)' y el 'Entrenador Asociado'. Les proporciona las herramientas para crear y distribuir contenido de video, un pilar fundamental en el marketing de fitness. El Administrador tiene acceso total para crear campañas para todo el negocio, mientras que un Entrenador Asociado podría tener permisos para crear contenido relacionado con sus propios clientes o programas específicos. El 'Administrador del Sistema' tiene acceso de supervisión y gestión de la configuración global (ej. integraciones de API).
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/content/video-studio
## Descripción Funcional
El 'Video Studio' de TrainerERP es un centro de creación de contenido audiovisual diseñado específicamente para las necesidades del profesional del fitness. Esta herramienta elimina la complejidad y el alto coste de los editores de video profesionales, ofreciendo una interfaz intuitiva y optimizada para crear videos de marketing de alto impacto en minutos. Los entrenadores pueden transformar sus ideas en contenido atractivo, desde tutoriales de ejercicios detallados y videos motivacionales, hasta impresionantes transformaciones de 'antes y después' de sus clientes y promociones de nuevos programas de entrenamiento. La funcionalidad incluye una biblioteca de plantillas temáticas (ej: 'Workout of the Day', 'Lanzamiento de Programa', 'Tip Nutricional Rápido') que se pueden personalizar con la marca del entrenador (logos, colores, fuentes). Además, permite una edición básica pero potente: recortar clips, añadir superposiciones de texto, incluir llamadas a la acción y seleccionar música de una biblioteca libre de derechos. La verdadera potencia reside en su componente de automatización. Una vez que un video está listo, se puede programar para su publicación simultánea en múltiples plataformas clave como Instagram (Reels), TikTok y YouTube (Shorts), asegurando una presencia de marca consistente y ahorrando horas de trabajo manual cada semana. Todo el contenido creado se almacena en una biblioteca de medios centralizada, permitiendo reutilizar clips de ejercicios y otros activos fácilmente en futuras creaciones.
## Valor de Negocio
En el competitivo nicho del fitness, el video no es una opción, es una necesidad. El 'Video Studio' de TrainerERP aporta un valor de negocio inmenso al democratizar la producción de video profesional para entrenadores personales y estudios. Reduce drásticamente la barrera de entrada, eliminando la necesidad de invertir en software de edición costoso (como Adobe Premiere) o contratar a videógrafos externos. Esto se traduce en un ahorro directo de costes y tiempo. Al permitir a los entrenadores crear y distribuir contenido de alta calidad de forma autónoma y rápida, se potencia directamente la captación de leads. Un video de transformación de un cliente o el lanzamiento de un nuevo reto puede volverse viral y atraer a decenas de nuevos clientes potenciales. Además, mejora la retención al permitir la creación de contenido de valor para los clientes existentes (tutoriales, consejos). La automatización de la publicación en redes sociales garantiza una presencia de marca constante y profesional, un factor clave para el crecimiento orgánico. En resumen, esta herramienta transforma al entrenador en un creador de contenido eficiente, fortaleciendo su marca personal, ampliando su alcance y, en última instancia, impulsando el crecimiento de sus ingresos al convertir seguidores en clientes de pago.
## Prioridad / Roadmap
- Impacto: medio
- Complejidad: alta
- Fase recomendada: Premium
## User Stories
- Como entrenador online, quiero usar una plantilla de 'Lanzamiento de Programa' para crear un video corto y dinámico sobre mi nuevo reto de 6 semanas, para poder publicarlo en Instagram Reels y generar expectación.
- Como propietario de un estudio de fitness, quiero subir videos de mis clientes realizando ejercicios con la técnica correcta, añadirles mi logo y programarlos para que se publiquen tres veces por semana en TikTok y YouTube Shorts, para posicionarme como una autoridad en entrenamiento.
- Como entrenador personal independiente, quiero compilar varios clips cortos de testimonios de clientes en un solo video, añadirles texto con sus resultados y una música motivacional, para usarlo como prueba social en mi landing page.
- Como coach de grupos pequeños, quiero crear rápidamente un video de 'Tip Rápido' sobre nutrición, grabándolo desde mi móvil, subiéndolo a TrainerERP para recortarlo y añadirle subtítulos, y así mantener a mi comunidad enganchada.
- Como administrador de un centro de fitness, quiero acceder a un panel con métricas básicas de mis videos publicados, como visualizaciones y engagement, para entender qué tipo de contenido funciona mejor y planificar futuras campañas.
## Acciones Clave
- Crear un nuevo proyecto de video seleccionando una plantilla específica para fitness (ej: 'Tutorial de Ejercicio').
- Subir y gestionar clips de video, imágenes (logos) y archivos de audio en la biblioteca de medios personal.
- Editar un video en la línea de tiempo: recortar, unir clips, añadir superposiciones de texto y aplicar la identidad de marca (logo, colores).
- Programar un video finalizado para su publicación automática en las cuentas de redes sociales conectadas (Instagram, TikTok, YouTube).
- Navegar por la biblioteca de videos para reutilizar, editar o descargar proyectos anteriores.
- Revisar las estadísticas de rendimiento de los videos publicados para medir su impacto.
## 🧩 Componentes React Sugeridos
### 1. VideoEditorLayout
Tipo: container | Componente principal que orquesta toda la interfaz del editor de video. Maneja el estado del proyecto activo, carga los datos del video y coordina las interacciones entre el reproductor, la línea de tiempo y la biblioteca de medios.
Props:
- projectId: 
- string | null (requerido) - ID del proyecto de video a editar. Si es nulo, se inicia un nuevo proyecto.
Estados: currentProjectState, isPlaying, currentTime, isLoading, error
Dependencias: React Player, Zustand (para el estado global del proyecto)
Ejemplo de uso:
```typescript
<VideoEditorLayout projectId="vid_12345abc" />
```

### 2. VideoTimeline
Tipo: presentational | Componente visual e interactivo que renderiza las pistas de video, audio y texto. Permite al usuario manipular los clips (arrastrar, recortar, reordenar) y emite eventos al componente padre para actualizar el estado del proyecto.
Props:
- timelineData: 
- TimelineData (requerido) - Objeto que describe todas las pistas y clips en la línea de tiempo.
- onClipUpdate: 
- (clipId: string, updates: Partial<Clip>) => void (requerido) - Callback que se ejecuta cuando un clip es modificado por el usuario.
- currentTime: 
- number (requerido) - El tiempo actual de reproducción para mostrar el cabezal de lectura.
Estados: draggedClipId, resizeMode
Dependencias: dnd-kit (para drag and drop)
Ejemplo de uso:
```typescript
<VideoTimeline timelineData={project.timeline} onClipUpdate={handleUpdate} currentTime={playerTime} />
```

### 3. MediaLibraryPanel
Tipo: container | Panel lateral que muestra los activos de medios del usuario (videos, logos, música). Gestiona la subida de nuevos archivos y permite al usuario arrastrarlos a la línea de tiempo.
Props:
- onAssetSelect: 
- (asset: MediaAsset) => void (requerido) - Callback que se invoca cuando un usuario selecciona o arrastra un activo para añadirlo al proyecto.
Estados: mediaAssets, uploadProgress, isLoading, activeTab ('videos', 'logos', 'audio')
Dependencias: axios, react-dropzone
Ejemplo de uso:
```typescript
<MediaLibraryPanel onAssetSelect={addAssetToTimeline} />
```

### 4. SocialSchedulerModal
Tipo: container | Modal que se abre para programar la publicación de un video. Permite seleccionar plataformas, escribir descripciones personalizadas para cada una y elegir fecha y hora de publicación.
Props:
- videoId: 
- string (requerido) - ID del video que se va a programar.
- isOpen: 
- boolean (requerido) - Controla la visibilidad del modal.
- onClose: 
- () => void (requerido) - Función para cerrar el modal.
Estados: selectedPlatforms, captionsByPlatform, scheduleDateTime, isSubmitting
Dependencias: react-datepicker
Ejemplo de uso:
```typescript
<SocialSchedulerModal videoId="vid_12345abc" isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
```
## 🔌 APIs Requeridas
### 1. POST /api/content/videos
Inicia la creación de un nuevo proyecto de video, ya sea desde cero o basado en una plantilla, y opcionalmente inicia la subida de un archivo de video.
Parámetros:
- title (
- string, body, requerido): Título inicial del proyecto de video.
- templateId (
- string, body, opcional): ID opcional de la plantilla a utilizar.
Respuesta:
Tipo: object
Estructura: Objeto que representa el nuevo proyecto de video creado, incluyendo su ID.
```json
{
  "videoId": "vid_abc123xyz",
  "title": "Mi Nuevo Video Promocional",
  "status": "draft",
  "createdAt": "2023-10-27T10:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Falta el título o el ID de la plantilla es inválido.
- 500: 
- Internal Server Error - Error al crear el registro en la base de datos.

### 2. GET /api/content/videos
Obtiene una lista paginada de todos los proyectos de video del usuario autenticado.
Parámetros:
- page (
- number, query, opcional): Número de página para la paginación.
- limit (
- number, query, opcional): Número de resultados por página.
- sortBy (
- string, query, opcional): Campo por el cual ordenar (ej: 'createdAt', 'title').
Respuesta:
Tipo: object
Estructura: Un objeto con la lista de videos y metadatos de paginación.
```json
{
  "data": [
    {
      "videoId": "vid_abc123xyz",
      "title": "Video Promocional",
      "status": "published",
      "thumbnailUrl": "https://cdn.trainererp.com/thumb1.jpg",
      "duration": 35,
      "createdAt": "2023-10-26T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El usuario no está autenticado.

### 3. PUT /api/content/videos/{videoId}
Actualiza los datos de un proyecto de video, principalmente la estructura de la línea de tiempo (timelineData). Esta API se llama al guardar el proyecto.
Parámetros:
- videoId (
- string, path, requerido): ID del video a actualizar.
- title (
- string, body, opcional): El nuevo título del video.
- timelineData (
- object, body, opcional): El objeto JSON que representa el estado actual de la línea de tiempo.
Respuesta:
Tipo: object
Estructura: El objeto del video actualizado.
```json
{
  "videoId": "vid_abc123xyz",
  "title": "Video Promocional Final",
  "status": "draft",
  "updatedAt": "2023-10-27T11:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 403: 
- Forbidden - El usuario no tiene permisos para editar este video.
- 404: 
- Not Found - El videoId no existe.

### 4. POST /api/content/videos/{videoId}/schedule
Programa un video finalizado para su publicación en una o más redes sociales.
Parámetros:
- videoId (
- string, path, requerido): ID del video a programar.
- publications (
- array, body, requerido): Un array de objetos, cada uno especificando una plataforma, cuenta y el contenido.
- publishAt (
- string (ISO 8601), body, requerido): La fecha y hora en UTC para la publicación.
Respuesta:
Tipo: object
Estructura: Un objeto confirmando la programación.
```json
{
  "message": "Video scheduled successfully",
  "jobIds": [
    "job_insta_123",
    "job_tiktok_456"
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - El video no está en estado 'ready' para ser publicado, o los datos de publicación son inválidos.
- 422: 
- Unprocessable Entity - Una de las cuentas sociales conectadas no es válida o tiene los permisos revocados.

### 5. POST /api/content/media-assets/upload-url
Solicita una URL de subida pre-firmada (presigned URL) a un bucket de S3 para subir un archivo de video de forma segura y directa desde el cliente.
Parámetros:
- filename (
- string, body, requerido): El nombre del archivo que se va a subir.
- contentType (
- string, body, requerido): El tipo MIME del archivo (ej: 'video/mp4').
Respuesta:
Tipo: object
Estructura: Un objeto con la URL pre-firmada y el ID del activo que se creará.
```json
{
  "uploadUrl": "https://s3.amazonaws.com/trainererp-media/...?AWSAccessKeyId=...",
  "assetId": "asset_xyz789"
}
```
Autenticación: Requerida
Errores posibles:
- 500: 
- Internal Server Error - Fallo en la comunicación con el proveedor de almacenamiento (S3).
## Notas Técnicas
Colecciones backend: videos (contiene metadata: projectId, userId, title, description, status, duration, sourceFileUrl, processedUrls, timelineDataJson), media_assets (almacena archivos subidos por el usuario: assetId, userId, type, url, name), video_templates (definiciones de plantillas: templateId, name, structureJson, previewUrl), social_connections (tokens de acceso para APIs de redes sociales: connectionId, userId, platform, accessToken, refreshToken, expiresAt), publishing_queue (trabajos de publicación programados: jobId, videoId, connectionId, publishAt, status, caption)
KPIs visibles: Videos Publicados (últimos 30 días), Visualizaciones Totales Acumuladas, Tasa de Engagement Promedio (likes+comments+shares / views), Alcance por Plataforma (desglose de visualizaciones por Instagram, TikTok, etc.), Top 3 Videos con Mejor Rendimiento (por engagement), Próximas Publicaciones Programadas
## Documentación Completa
## Resumen
El módulo de **Video Marketing & Automation**, conocido internamente como **Video Studio**, es una herramienta estratégica dentro del área funcional de 'CONTENIDO & REDES SOCIALES' de TrainerERP. Su objetivo principal es empoderar a los entrenadores personales y estudios de fitness para que puedan crear, editar y distribuir videos de marketing de calidad profesional sin necesidad de conocimientos técnicos avanzados o software costoso. Esta funcionalidad aborda una necesidad crítica en el sector del fitness, donde el contenido de video (tutoriales, testimonios, promociones) es el principal motor para la captación de clientes y la construcción de una comunidad.
El sistema proporciona una experiencia de edición simplificada basada en plantillas y una línea de tiempo intuitiva. Los usuarios pueden subir sus propios clips, añadir logos, texto, música de una biblioteca libre de derechos y, lo más importante, programar la publicación del contenido finalizado en múltiples plataformas sociales (Instagram Reels, TikTok, YouTube Shorts) con un solo clic. Esto no solo ahorra tiempo, sino que también garantiza una estrategia de contenido coherente y constante, vital para el crecimiento de la marca personal del entrenador.
## Flujo paso a paso de uso real
Imaginemos a **Laura, una entrenadora online especializada en calistenia**. Quiere lanzar un nuevo programa de 4 semanas llamado 'Calistenia Core'.
1. **Inicio del Proyecto:** Laura accede a `TrainerERP > Contenido > Video Studio` y hace clic en 'Crear Nuevo Video'. Se le presenta una galería de plantillas. Elige la plantilla 'Lanzamiento de Programa'.
2. **Personalización:** La plantilla ya tiene una estructura predefinida: una intro energética, secciones para mostrar ejercicios, un espacio para texto con beneficios y un cierre con llamada a la acción (CTA). Laura sube varios clips cortos que ha grabado de sí misma realizando los ejercicios clave del programa. Arrastra y suelta estos clips en los marcadores de posición de la línea de tiempo, reemplazando el contenido genérico.
3. **Branding y Edición:** En la pista de superposición, sube su logo, que se muestra en la esquina superior derecha durante todo el video. Edita los campos de texto para reflejar los detalles de su programa: '¡Domina tu Core en 4 Semanas!', 'Inscripciones Abiertas'.
4. **Audio:** Navega por la biblioteca de música y elige una pista electrónica motivacional que se ajusta al ritmo del video. Ajusta el volumen para que no opaque su voz si hubiera añadido una narración.
5. **Revisión y Renderizado:** Laura previsualiza el video completo. Satisfecha con el resultado, hace clic en 'Renderizar'. El sistema procesa el video en segundo plano, notificándole cuando está listo (normalmente en un par de minutos).
6. **Programación y Automatización:** Con el video finalizado, hace clic en 'Programar Publicación'. Aparece un modal donde selecciona sus cuentas conectadas de Instagram y TikTok. Escribe una descripción ligeramente diferente para cada plataforma, usando hashtags relevantes. Fija la fecha de publicación para el próximo lunes a las 7:00 AM, su hora de mayor engagement. Confirma la programación.
7. **Publicación y Análisis:** El lunes, el sistema de TrainerERP publica automáticamente el video en ambas plataformas. Días después, Laura vuelve al Video Studio y revisa el dashboard de analíticas, observando que el video ha alcanzado 5,000 visualizaciones en TikTok y ha generado 15 comentarios en Instagram preguntando por el precio del programa.
## Riesgos operativos y edge cases
- **Expiración de Tokens de API:** Los tokens de OAuth2 de las redes sociales expiran. El sistema debe tener un cronjob que verifique la validez de los tokens y notifique proactivamente al usuario para que vuelva a conectar su cuenta si es necesario. Si un token expira justo antes de una publicación programada, el trabajo debe marcarse como 'fallido' y se debe enviar una alerta inmediata al usuario.
- **Fallas en Transcodificación:** Un archivo de video subido puede estar corrupto o usar un códec no estándar. Nuestro backend de video (posiblemente usando AWS Elemental MediaConvert o FFMPEG) debe capturar estos errores, marcar el activo como 'fallido' en la biblioteca de medios y mostrar un mensaje claro al usuario sobre el problema.
- **Violación de Políticas de Plataforma:** Un usuario podría subir contenido que viole las políticas de Instagram o TikTok (ej. música con copyright no licenciada). Si bien no podemos ser la policía del contenido, debemos tener un disclaimer claro en los Términos de Servicio. Además, nuestra biblioteca de música debe ser 100% libre de derechos para mitigar este riesgo. Si una publicación falla debido a una violación, debemos intentar parsear la respuesta de la API para informar al usuario de la causa.
- **Gestión de Almacenamiento y Costes:** Los archivos de video son grandes. Debemos usar un almacenamiento de objetos como S3. Se deben implementar políticas de ciclo de vida para mover videos antiguos o no utilizados a un almacenamiento más frío (Glacier) para controlar los costes. Se deben establecer límites de almacenamiento por plan de suscripción.
## KPIs y qué significan
- **Videos Publicados:** Mide la adopción y el uso activo de la herramienta. Un número creciente indica que los usuarios encuentran valor en la funcionalidad.
- **Visualizaciones Totales:** KPI de vanidad, pero importante para medir el alcance y la visibilidad de la marca del entrenador. Ayuda a entender el tamaño de la audiencia impactada.
- **Tasa de Engagement Promedio:** (Likes + Comentarios + Shares) / Visualizaciones. Este es el KPI más importante. Mide qué tan bien resuena el contenido con la audiencia. Una tasa alta indica contenido de calidad que genera interacción y construye comunidad.
- **Alcance por Plataforma:** Permite al entrenador identificar en qué red social su contenido tiene mejor rendimiento, permitiéndole enfocar sus esfuerzos de manera más efectiva.
- **Top 3 Videos con Mejor Rendimiento:** Identifica los 'ganadores' para que el entrenador pueda analizar qué los hizo exitosos y replicar esa fórmula en futuras creaciones. Es una herramienta de aprendizaje y optimización.
## Diagramas de Flujo (Mermaid)
**Flujo de Procesamiento y Publicación de Video:**
mermaid
graph TD
A[Usuario sube archivo de video desde el cliente] --> B{Solicita URL Pre-firmada a TrainerERP API};
B --> C[API genera URL de S3 y la devuelve al cliente];
C --> D[Cliente sube el archivo directamente a S3];
D -- Notificación de subida completa --> E{Trigger de AWS Lambda / Evento S3};
E --> F[Servicio de Transcodificación (MediaConvert)];
F --> G{Genera múltiples formatos y calidades};
G --> H[Almacena versiones procesadas en S3];
H --> I[Actualiza estado del video en DB a 'ready'];
J[Usuario programa la publicación] --> K{Crea un trabajo en la cola de publicación};
K --> L[Scheduler Service (Cron Job)];
L -- A la hora programada --> M{Recupera video y datos de la publicación};
M --> N[Llama a la API de la Red Social (ej. Instagram Graph API)];
N -- Éxito --> O[Actualiza estado a 'published' y guarda analíticas];
N -- Fallo --> P[Registra el error y notifica al usuario];
