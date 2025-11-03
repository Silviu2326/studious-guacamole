# Community & Engagement

**Página padre:** Hola

---

# Community & Engagement
👥 Tipo de Usuario: Entrenador Personal (Administrador), Cliente, Entrenador Asociado
Esta funcionalidad es central para dos roles principales: 'Cliente', que participa activamente creando contenido, interactuando y consumiendo información; y 'Entrenador Personal' (o 'Entrenador Asociado'), que actúa como administrador, moderador y líder de la comunidad. El Entrenador puede crear grupos exclusivos (ej. para un reto de 90 días), fijar publicaciones importantes, moderar contenido, y analizar las métricas de participación. El Cliente puede unirse a grupos, publicar su progreso (fotos de transformación, récords personales), hacer preguntas, y apoyar a otros miembros.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/comunidad
## Descripción Funcional
La página de 'Community & Engagement' es el corazón social de TrainerERP, un espacio digital privado y exclusivo diseñado para que los entrenadores construyan un ecosistema de apoyo y motivación alrededor de su marca. Va más allá de un simple foro; es una plataforma interactiva donde los clientes pueden compartir sus victorias, como un nuevo récord personal en sentadillas o una foto de su preparación de comidas semanal. Dispone de un 'Wall de Logros' principal que funciona como un feed social, mostrando las últimas publicaciones, fotos y videos de los miembros. Los entrenadores pueden crear foros y grupos segmentados por temas específicos como 'Nutrición y Macros', 'Técnica de Ejercicios', o 'Mindset y Motivación', permitiendo conversaciones enfocadas. Además, pueden lanzar grupos privados para cohortes específicas de clientes, como los participantes de un 'Reto de Transformación'. La plataforma integra un sistema de gamificación con logros y badges (ej. 'Guerrero del Gym: 50 Sesiones Registradas') para incentivar la participación constante. La funcionalidad de chat grupal facilita la comunicación en tiempo real dentro de los grupos, mientras que las herramientas de moderación aseguran que el ambiente se mantenga positivo y constructivo. En esencia, esta página transforma la experiencia de entrenamiento de una relación uno a uno a una comunidad vibrante que fomenta la camaradería, la responsabilidad y, en última instancia, la retención de clientes.
## Valor de Negocio
El valor de negocio de la funcionalidad 'Community & Engagement' es inmenso y multifacético para un entrenador personal. Su principal contribución es el drástico aumento en la retención de clientes. Al crear un sentido de pertenencia y apoyo mutuo, los clientes se sienten parte de algo más grande que un simple plan de entrenamiento, lo que disminuye significativamente la tasa de abandono (churn). Esta comunidad se convierte en un poderoso foso competitivo (moat) para el entrenador, haciendo que sea mucho más difícil para un cliente cambiarse a otro servicio que no ofrezca este valor añadido. Adicionalmente, fomenta mejores resultados en los clientes a través de la motivación y la responsabilidad compartida, lo que a su vez genera testimonios y pruebas sociales más potentes (transformaciones, historias de éxito) que pueden ser utilizadas en marketing para atraer nuevos leads. También optimiza el tiempo del entrenador; las preguntas comunes se responden una vez en el foro para beneficio de todos, reduciendo la carga de soporte individual. Finalmente, abre nuevas vías de monetización: el entrenador puede crear 'grupos premium' de pago para retos específicos, coaching grupal avanzado o acceso a contenido exclusivo, generando ingresos adicionales sobre las suscripciones existentes.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como Cliente, quiero publicar un video de mi levantamiento de peso muerto para que mi entrenador y la comunidad puedan darme feedback sobre mi técnica.
- Como Entrenador Personal, quiero crear un grupo privado y exclusivo para mis clientes del 'Programa de Preparación para Competición', para compartirles contenido específico y que puedan apoyarse mutuamente.
- Como Cliente, quiero recibir una notificación y un badge de 'Consistencia Semanal' cuando haya completado todos mis entrenamientos programados de la semana, para sentirme motivado y reconocido.
- Como Entrenador Asociado, quiero poder filtrar el feed para ver todas las publicaciones marcadas como 'Pregunta' para poder responder rápidamente a las dudas de los clientes.
- Como Cliente nuevo, quiero poder buscar en la comunidad el término 'recetas ricas en proteína' para encontrar ideas y consejos de otros miembros más experimentados.
## Acciones Clave
- Crear una nueva publicación (con texto, imagen, video o encuesta).
- Comentar y reaccionar (celebrar, apoyar, etc.) a las publicaciones de otros miembros.
- Unirse a un grupo público o solicitar acceso a un grupo privado.
- Moderar una publicación o comentario (acción exclusiva para Entrenadores).
- Filtrar el 'Wall de Logros' por grupo, tema o miembro específico.
- Ver el perfil de otro miembro de la comunidad y sus badges obtenidos.
- Recibir notificaciones sobre actividad relevante (nuevos comentarios, reacciones, anuncios del entrenador).
## 🧩 Componentes React Sugeridos
### 1. CommunityFeed
Tipo: container | Componente principal que obtiene y renderiza la lista de publicaciones de la comunidad. Maneja la paginación (scroll infinito), la lógica de filtrado y la actualización en tiempo real de nuevas publicaciones.
Props:
- groupId: 
- string | null (opcional) - ID del grupo para filtrar el feed. Si es nulo, muestra el feed general.
- filterBy: 
- 'latest' | 'trending' | 'questions' (requerido) - Criterio para ordenar y filtrar las publicaciones.
Estados: posts: Post[], isLoading: boolean, error: string | null, currentPage: number, hasMore: boolean
Dependencias: react-query, react-infinite-scroller
Ejemplo de uso:
```typescript
<CommunityFeed filterBy='latest' groupId='group-nutrition-123' />
```

### 2. PostCard
Tipo: presentational | Componente de UI que muestra una única publicación. Incluye el avatar y nombre del autor, el contenido del post (texto, imagen/video), contador de reacciones y comentarios, y las acciones (reaccionar, comentar, reportar).
Props:
- post: 
- Post (requerido) - Objeto que contiene toda la información de la publicación.
- onReact: 
- (postId: string, reactionType: string) => void (requerido) - Función callback que se ejecuta cuando el usuario reacciona a la publicación.
- onComment: 
- (postId: string) => void (requerido) - Función callback que se ejecuta para abrir el modal o la vista de comentarios.
Dependencias: date-fns
Ejemplo de uso:
```typescript
<PostCard post={postData} onReact={handleReaction} onComment={handleOpenComments} />
```

### 3. NewPostForm
Tipo: container | Formulario para crear una nueva publicación. Maneja el estado del texto, la subida de archivos (imágenes/videos) con previsualización, la selección del grupo donde se publicará y la lógica de envío a la API.
Props:
- availableGroups: 
- Group[] (requerido) - Array de grupos a los que el usuario puede publicar.
- onSubmitSuccess: 
- () => void (opcional) - Callback que se ejecuta tras crear la publicación exitosamente, para por ejemplo, refrescar el feed.
Estados: content: string, mediaFile: File | null, selectedGroupId: string, isSubmitting: boolean
Dependencias: react-hook-form, axios
Ejemplo de uso:
```typescript
<NewPostForm availableGroups={userGroups} onSubmitSuccess={refreshFeed} />
```

### 4. useCommunityBadges
Tipo: hook | Custom hook que encapsula la lógica para obtener los badges de un usuario específico y los badges disponibles en la comunidad.
Props:
- userId: 
- string (requerido) - ID del usuario del cual se quieren obtener los badges.
Dependencias: react-query
Ejemplo de uso:
```typescript
const { userBadges, allBadges, isLoading } = useCommunityBadges(clientId);
```
## 🔌 APIs Requeridas
### 1. GET /api/community/posts
Obtiene una lista paginada de publicaciones para el feed de la comunidad. Permite filtrar por grupo.
Parámetros:
- page (
- number, query, opcional): Número de la página para la paginación.
- limit (
- number, query, opcional): Número de publicaciones por página.
- groupId (
- string, query, opcional): Filtra las publicaciones por un ID de grupo específico.
Respuesta:
Tipo: object
Estructura: Objeto con un array de publicaciones y metadatos de paginación.
```json
{
  "data": [
    {
      "id": "post_123",
      "author": {
        "id": "user_abc",
        "name": "Ana Pérez",
        "avatarUrl": "..."
      },
      "content": "¡Nuevo PR en peso muerto! 100kg. ¡Gracias coach!",
      "mediaUrl": "https://cdn.trainererp.com/video_123.mp4",
      "createdAt": "2023-10-27T10:00:00Z",
      "reactions": {
        "celebrate": 15,
        "support": 20
      },
      "commentCount": 5
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100
  }
}
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El usuario no está autenticado.
- 403: 
- Forbidden - El usuario no tiene permiso para ver el contenido de este grupo.

### 2. POST /api/community/posts
Crea una nueva publicación en la comunidad o en un grupo específico.
Parámetros:
- content (
- string, body, opcional): Texto de la publicación. Requerido si no hay mediaUrl.
- mediaUrl (
- string, body, opcional): URL del video o imagen subido previamente. Requerido si no hay content.
- groupId (
- string, body, opcional): ID del grupo donde se publicará. Si es nulo, se publica en el feed general.
Respuesta:
Tipo: object
Estructura: El objeto de la publicación recién creada.
```json
{
  "id": "post_124",
  "author": {
    "id": "user_xyz",
    "name": "Carlos Ruíz",
    "avatarUrl": "..."
  },
  "content": "Duda sobre macros, ¿alguien me ayuda?",
  "mediaUrl": null,
  "createdAt": "2023-10-27T11:00:00Z",
  "reactions": {},
  "commentCount": 0
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Falta el contenido (content o mediaUrl) o el groupId no es válido.
- 429: 
- Too Many Requests - El usuario está publicando con demasiada frecuencia (rate limiting).

### 3. POST /api/community/posts/{postId}/comments
Añade un comentario a una publicación existente.
Parámetros:
- postId (
- string, path, requerido): ID de la publicación a comentar.
- content (
- string, body, requerido): El texto del comentario.
Respuesta:
Tipo: object
Estructura: El objeto del comentario recién creado.
```json
{
  "id": "comment_789",
  "postId": "post_124",
  "author": {
    "id": "trainer_001",
    "name": "Entrenador David",
    "avatarUrl": "..."
  },
  "content": "¡Claro! Revisa el documento sobre macros en la sección de archivos del grupo de nutrición.",
  "createdAt": "2023-10-27T11:05:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - La publicación con el ID especificado no existe.

### 4. DELETE /api/community/posts/{postId}
Elimina una publicación. Solo puede ser ejecutado por el autor de la publicación o un moderador (entrenador).
Parámetros:
- postId (
- string, path, requerido): ID de la publicación a eliminar.
Respuesta:
Tipo: object
Estructura: Mensaje de confirmación.
```json
{
  "status": "success",
  "message": "Post deleted successfully."
}
```
Autenticación: Requerida
Errores posibles:
- 403: 
- Forbidden - El usuario no tiene permisos para eliminar esta publicación.
- 404: 
- Not Found - La publicación a eliminar no existe.
## Notas Técnicas
Colecciones backend: communities, groups, posts, comments, reactions, user_profiles_community, badges, user_badges, moderation_flags, notifications
KPIs visibles: Tasa de Participación Diaria (Miembros activos / Total de miembros), Número de Publicaciones por Semana, Promedio de Comentarios por Publicación, Tiempo de Primera Respuesta del Entrenador (a publicaciones con preguntas), Miembros más Activos (Ranking), Tasa de Crecimiento de la Comunidad (Nuevos miembros por mes)
## Documentación Completa
## Resumen
El módulo de 'Community & Engagement' es una plataforma social privada integrada en TrainerERP, diseñada para que los entrenadores fomenten una comunidad de apoyo, motivación y responsabilidad entre sus clientes. Su objetivo es transformar la experiencia de entrenamiento de un servicio transaccional a una membresía en un club exclusivo. Esto se logra a través de un 'Wall de Logros' interactivo, foros temáticos, grupos privados para retos, un sistema de gamificación con badges y herramientas de moderación. Para el entrenador, es una herramienta estratégica clave para aumentar la retención de clientes, generar prueba social auténtica, optimizar su tiempo de soporte y crear nuevas oportunidades de monetización. Para el cliente, es un espacio seguro para compartir su progreso, resolver dudas, encontrar inspiración y conectar con personas que comparten sus mismos objetivos de fitness, mejorando sus resultados y su satisfacción general con el servicio del entrenador.
---
## Flujo paso a paso de uso real
**Escenario 1: El Cliente comparte un logro**
1. **Inicio:** Ana, una clienta, acaba de completar su entrenamiento más duro de la semana.
2. **Acceso:** Abre la app de TrainerERP y navega a la sección 'Comunidad'.
3. **Creación:** Pulsa el botón 'Crear Publicación'. Escribe: '¡Semana 4 completada! Me sentí súper fuerte hoy en las sentadillas. ¡Vamos a por más! 💪'.
4. **Multimedia:** Adjunta una foto suya en el gimnasio después del entrenamiento.
5. **Publicación:** Selecciona que la publicación sea visible para el 'Grupo General' y la publica.
6. **Interacción:** En minutos, recibe reacciones de 'celebración' de otros miembros. Su entrenador, David, comenta: '¡Excelente trabajo, Ana! Tu constancia está dando frutos. Sigue así.'
7. **Resultado:** Ana se siente reconocida y motivada, reforzando su compromiso con el programa.
**Escenario 2: El Entrenador gestiona un reto**
1. **Creación de Grupo:** David, el entrenador, lanza un 'Reto de 21 Días de Nutrición'. Desde el panel de Comunidad, crea un nuevo 'Grupo Privado' con ese nombre.
2. **Invitación:** Invita a todos los clientes que se inscribieron en el reto.
3. **Publicación Fijada:** Dentro del grupo, crea una publicación con las reglas del reto, el plan de comidas y el calendario. La 'fija' en la parte superior para que siempre esté visible.
4. **Dinamización:** Cada día, David publica un consejo de nutrición o una mini-tarea, como 'Comparte una foto de tu desayuno saludable de hoy'.
5. **Moderación:** Un miembro publica un enlace a un producto no aprobado. David recibe una notificación de reporte, revisa la publicación, la elimina y envía un mensaje privado al miembro explicando las reglas de la comunidad.
6. **Resultado:** El reto se desarrolla en un entorno organizado y exclusivo, aumentando el valor percibido y asegurando que todos los participantes tengan la información correcta y se mantengan comprometidos.
---
## Riesgos operativos y edge cases
* **Contenido Negativo o Tóxico:** El mayor riesgo es que la comunidad se convierta en un lugar de quejas, bullying o difusión de información dañina (ej. consejos de dietas extremas no respaldadas). **Mitigación:** Implementar un sistema de moderación proactivo y reactivo. Esto incluye filtros de palabras clave, un botón de 'Reportar' fácil de usar para los miembros, y un panel de moderación claro para el entrenador. Las reglas de la comunidad deben ser visibles y aceptadas al unirse.
* **Privacidad del Cliente:** Los clientes comparten datos sensibles como fotos de su progreso físico. **Mitigación:** Controles de privacidad granulares. Los perfiles deben ser visibles solo para otros miembros de la comunidad. Las publicaciones en grupos privados deben ser estrictamente inaccesibles desde fuera del grupo. Se debe informar claramente qué información es visible para quién.
* **Baja Adopción ('Comunidad Fantasma'):** Si el entrenador crea la comunidad pero no hay participación, el efecto es negativo. **Mitigación:** El entrenador debe ser el principal dinamizador al principio. Estrategias como 'posts de bienvenida' automáticos para nuevos miembros, retos semanales, sesiones de Q&A en vivo dentro de la comunidad, y el sistema de gamificación (badges) son cruciales para generar el impulso inicial.
* **Edge Case - Disputas entre miembros:** ¿Cómo se manejan los conflictos personales? **Mitigación:** Establecer un protocolo de mediación claro en las reglas. El entrenador no debe ser un juez, sino un moderador que puede silenciar o, en casos extremos, expulsar a miembros que violen las normas de respeto.
---
## KPIs y qué significan
* **Tasa de Participación Diaria (DAU/Total):** Mide qué tan 'pegajosa' es la comunidad. Un % alto indica que los clientes la han incorporado a su rutina diaria. Un % bajo puede señalar que el contenido no es relevante o que faltan incentivos para volver.
* **Número de Publicaciones por Semana:** Un indicador directo de la cantidad de contenido generado por los usuarios. Si este número crece, la comunidad se está volviendo autosuficiente. Si decrece, puede necesitar un impulso del entrenador.
* **Promedio de Comentarios por Publicación:** Mide la calidad de la conversación. Un número alto sugiere que las publicaciones generan diálogo y no son solo monólogos. Es un buen indicador de una comunidad saludable y conectada.
* **Tiempo de Primera Respuesta del Entrenador:** Específicamente para publicaciones marcadas como 'Pregunta'. Mide la eficiencia del soporte del entrenador dentro de la comunidad. Un tiempo bajo aumenta enormemente el valor percibido por el cliente.
* **Tasa de Crecimiento de la Comunidad:** Mide cuántos de los nuevos clientes del entrenador se unen activamente a la comunidad. Una tasa alta indica que la comunidad se está posicionando como una parte central del servicio ofrecido.
---
## Diagramas de Flujo (Mermaid)
**Ciclo de Vida de una Publicación:**
mermaid
stateDiagram-v2
[*] --> Draft
Draft --> Published: User clicks 'Post'
Published --> Reported: Member reports post
Published --> Deleted: Author or Admin deletes
Reported --> Published: Admin reviews and approves
Reported --> Deleted: Admin reviews and deletes
Deleted --> [*]
