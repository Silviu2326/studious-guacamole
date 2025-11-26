# Review & Testimonial Engine

**Página padre:** Hola

---

# Review & Testimonial Engine
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado, Administrador del Sistema
Esta funcionalidad es principalmente para el 'Entrenador Personal (Administrador)' y los 'Entrenadores Asociados' que gestionan clientes. Les permite centralizar y automatizar la gestión de su reputación online, una pieza clave para el crecimiento de su negocio. Los clientes interactúan con este sistema de forma indirecta, al recibir las solicitudes de reseña y al ver los testimonios publicados.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/reviews
## Descripción Funcional
El 'Review & Testimonial Engine' es el centro de mando para la reputación y prueba social de un entrenador personal dentro de TrainerERP. Esta página va más allá de un simple listado de comentarios; es un sistema proactivo diseñado para capitalizar el éxito de los clientes y convertirlo en un potente activo de marketing. Permite al entrenador automatizar la solicitud de reseñas en momentos clave del viaje del cliente, como al finalizar un programa de 12 semanas, alcanzar un hito de pérdida de peso, o después de un número determinado de sesiones. El sistema se integra directamente con plataformas cruciales como Google My Business y Facebook, centralizando todas las reseñas en un único dashboard. Desde aquí, el entrenador puede leer, responder y gestionar cada testimonio. La funcionalidad más potente es la capacidad de transformar una reseña positiva en contenido listo para redes sociales con un solo clic, aplicando plantillas de marca para crear publicaciones para Instagram, Facebook o LinkedIn. Además, permite etiquetar y categorizar testimonios (por ejemplo, 'transformación corporal', 'preparación para maratón') para luego mostrarlos dinámicamente en landing pages específicas, aumentando la relevancia y la conversión. También incluye un sistema de alertas para reseñas negativas, permitiendo una gestión de crisis rápida y profesional.
## Valor de Negocio
En el competitivo mundo del entrenamiento personal, la confianza es la moneda más valiosa. El 'Review & Testimonial Engine' automatiza la construcción de esta confianza, convirtiendo los resultados de los clientes en un motor de crecimiento orgánico. Para un entrenador, esto significa menos tiempo persiguiendo testimonios y más tiempo entrenando. Al sistematizar la recolección de reseñas en los picos de satisfacción del cliente, se asegura un flujo constante de prueba social auténtica y de alta calidad. Este contenido no solo atrae a nuevos leads, sino que también justifica precios premium y reduce la fricción en el proceso de venta. Un lead que ha visto 10 historias de éxito de personas como él está mucho más cerca de la conversión. Al integrar la gestión de reseñas con la creación de contenido de marketing, se cierra el ciclo: el éxito del cliente alimenta el marketing, que atrae a nuevos clientes, generando más historias de éxito. Esto crea un volante de inercia para el negocio del entrenador, reduce la dependencia de la publicidad de pago y construye una marca sólida y respetada en el mercado.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: media
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal independiente, quiero configurar una automatización que envíe una solicitud de reseña en Google a mis clientes una semana después de que completen su 'Programa de Transformación de 90 días', para capturar su feedback cuando están más satisfechos.
- Como propietario de un estudio de fitness, quiero tener un dashboard centralizado donde pueda ver y responder a todas las reseñas de Google y Facebook de mi negocio, para gestionar mi reputación online de manera eficiente sin tener que saltar entre plataformas.
- Como coach online, quiero poder seleccionar una reseña de 5 estrellas y, con un clic, convertirla en una imagen de marca para una historia de Instagram, para compartir fácilmente la prueba social con mis seguidores.
- Como entrenador, quiero recibir una notificación por email o SMS inmediatamente cuando reciba una reseña de 3 estrellas o menos, para poder abordarla rápidamente y demostrar un excelente servicio al cliente.
- Como entrenador que se especializa en la preparación de atletas, quiero etiquetar los testimonios relevantes como 'rendimiento deportivo' para poder mostrarlos automáticamente en mi landing page de captación de atletas.
## Acciones Clave
- Configurar y activar/desactivar flujos de automatización para la solicitud de reseñas.
- Conectar y sincronizar cuentas de Google My Business y Facebook Pages.
- Filtrar el listado de reseñas por fuente (Google, Facebook, Web), puntuación, fecha o estado (respondida, destacada).
- Crear una publicación para redes sociales a partir de una reseña existente utilizando plantillas predefinidas.
- Marcar/desmarcar reseñas como 'destacadas' para su uso en widgets y landing pages.
- Responder a una reseña (lo que abriría la plataforma correspondiente o utilizaría una API para responder directamente si está disponible).
## 🧩 Componentes React Sugeridos
### 1. ReviewDashboardContainer
Tipo: container | Componente principal que orquesta la página. Realiza las llamadas a la API para obtener las reseñas, gestiona el estado de los filtros, la paginación y pasa los datos a los componentes de presentación.
Estados: reviews: Review[], isLoading: boolean, error: string | null, filters: { source: string, rating: number, status: string }, pagination: { currentPage: number, totalPages: number }
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<ReviewDashboardContainer />
```

### 2. ReviewCard
Tipo: presentational | Muestra la información de una única reseña, incluyendo autor, puntuación, contenido y la plataforma de origen. Incluye botones de acción como 'Responder', 'Destacar' y 'Crear Publicación'.
Props:
- review: 
- Review (requerido) - Objeto que contiene todos los datos de la reseña.
- onFeature: 
- (reviewId: string) => void (requerido) - Función callback que se ejecuta al hacer clic en el botón 'Destacar'.
- onCreatePost: 
- (reviewId: string) => void (requerido) - Función callback que abre el modal para crear una publicación social.
Dependencias: styled-components
Ejemplo de uso:
```typescript
<ReviewCard review={sampleReview} onFeature={handleFeature} onCreatePost={handleCreatePost} />
```

### 3. ReviewFilterControls
Tipo: presentational | Barra de herramientas con controles (selects, botones) para que el usuario pueda filtrar la lista de reseñas por fuente, puntuación o estado.
Props:
- currentFilters: 
- { source: string, rating: number, status: string } (requerido) - El estado actual de los filtros.
- onFilterChange: 
- (newFilters: { source: string, rating: number, status: string }) => void (requerido) - Función que se llama cuando el usuario cambia un filtro.
Ejemplo de uso:
```typescript
<ReviewFilterControls currentFilters={filters} onFilterChange={setFilters} />
```

### 4. useReviewAutomations
Tipo: hook | Hook personalizado para abstraer la lógica de fetching y actualización de las reglas de automatización de reseñas.
Estados: automations: Automation[], isLoading: boolean, updateAutomation: (id: string, data: Partial<Automation>) => Promise<void>
Dependencias: react-query
Ejemplo de uso:
```typescript
const { automations, isLoading, updateAutomation } = useReviewAutomations();
```
## 🔌 APIs Requeridas
### 1. GET /api/reviews
Obtiene una lista paginada de todas las reseñas del entrenador, con capacidad de filtrado.
Parámetros:
- page (
- number, query, opcional): Número de la página a obtener.
- limit (
- number, query, opcional): Número de reseñas por página.
- source (
- string, query, opcional): Filtra por plataforma de origen (e.g., 'google', 'facebook').
- rating (
- number, query, opcional): Filtra por puntuación exacta (1-5).
Respuesta:
Tipo: object
Estructura: Objeto con una lista de reseñas y metadatos de paginación.
```json
{
  "data": [
    {
      "id": "rev_123",
      "source": "google",
      "rating": 5,
      "content": "¡El mejor entrenador! He conseguido mis objetivos en tiempo récord.",
      "authorName": "Ana García",
      "createdAt": "2023-10-27T10:00:00Z",
      "status": "new"
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
- Unauthorized - El token de autenticación es inválido o no se proporcionó.
- 400: 
- Bad Request - Parámetro de filtro inválido.

### 2. PATCH /api/reviews/{id}/status
Actualiza el estado de una reseña específica (e.g., marcarla como destacada).
Parámetros:
- id (
- string, path, requerido): ID de la reseña a actualizar.
- status (
- string, body, requerido): El nuevo estado para la reseña ('featured', 'read', 'archived').
Respuesta:
Tipo: object
Estructura: El objeto de la reseña actualizado.
```json
{
  "id": "rev_123",
  "source": "google",
  "rating": 5,
  "content": "¡El mejor entrenador! He conseguido mis objetivos en tiempo récord.",
  "authorName": "Ana García",
  "createdAt": "2023-10-27T10:00:00Z",
  "status": "featured"
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - La reseña con el ID proporcionado no existe.
- 403: 
- Forbidden - El usuario no tiene permisos para modificar esta reseña.

### 3. POST /api/reviews/integrations/sync
Inicia una sincronización manual de reseñas con las plataformas externas conectadas (Google, Facebook).
Parámetros:
- platform (
- string, body, opcional): Opcional. Especifica una única plataforma a sincronizar ('google', 'facebook'). Si se omite, sincroniza todas.
Respuesta:
Tipo: object
Estructura: Un objeto indicando el estado del proceso de sincronización.
```json
{
  "status": "sync_started",
  "message": "La sincronización con las plataformas ha comenzado. Puede tomar unos minutos.",
  "jobId": "sync_job_abc"
}
```
Autenticación: Requerida
Errores posibles:
- 409: 
- Conflict - Ya hay una sincronización en progreso.
- 400: 
- Bad Request - La plataforma especificada no está conectada o no es válida.

### 4. PUT /api/reviews/automations
Crea o actualiza una regla de automatización para solicitar reseñas.
Parámetros:
- trigger (
- object, body, requerido): Define el evento que dispara la automatización (e.g., 'program_completed').
- action (
- object, body, requerido): Define la acción a realizar (e.g., 'send_review_request_email').
- delay (
- object, body, opcional): Define un retraso antes de ejecutar la acción (e.g., { value: 2, unit: 'days' }).
Respuesta:
Tipo: object
Estructura: La regla de automatización creada o actualizada.
```json
{
  "id": "auto_456",
  "name": "Solicitud post-programa 90 días",
  "isActive": true,
  "trigger": {
    "type": "program_completed",
    "programId": "prog_xyz"
  },
  "action": {
    "type": "send_review_request",
    "channel": "email",
    "templateId": "tmpl_abc"
  },
  "delay": {
    "value": 2,
    "unit": "days"
  }
}
```
Autenticación: Requerida
Errores posibles:
- 422: 
- Unprocessable Entity - La estructura de la regla de automatización es inválida o faltan campos obligatorios.
## Notas Técnicas
Colecciones backend: reviews, clients, automations, connected_platforms, social_post_templates, review_widgets
KPIs visibles: Puntuación media general de reseñas, Número total de reseñas por plataforma (Google, Facebook, etc.), Tasa de solicitudes de reseña enviadas vs. recibidas (%), Tiempo medio de respuesta a reseñas negativas, Número de reseñas convertidas en contenido de marketing este mes, Tendencia de la puntuación media (últimos 90 días)
## Documentación Completa
## Resumen
El **Review & Testimonial Engine** es una funcionalidad estratégica dentro de TrainerERP, diseñada para transformar el éxito de los clientes en un motor de crecimiento sostenible para el negocio del entrenador. Su propósito es automatizar y centralizar la gestión de la prueba social, un elemento fundamental para generar confianza y atraer nuevos clientes en el sector del fitness y el bienestar. Este módulo permite a los entrenadores conectar sus perfiles de Google My Business y Facebook para agregar todas las reseñas en un único dashboard. Desde allí, pueden analizar su reputación, responder a los comentarios y, lo más importante, activar flujos de trabajo automatizados. Estos flujos solicitan reseñas a los clientes en momentos de máxima satisfacción, como al completar un programa o alcanzar un objetivo personal, maximizando la probabilidad de obtener testimonios positivos y detallados. Además, la herramienta integra la gestión de reputación con la creación de contenido, permitiendo convertir cualquier reseña en una publicación de marca para redes sociales con plantillas personalizables, cerrando así el ciclo de marketing de prueba social.
---
## Flujo paso a paso de uso real
1. **Configuración Inicial (Onboarding):** Un entrenador, llamémosle Carlos, accede por primera vez al 'Review Engine'. El sistema le guía para conectar sus cuentas. Primero, se autentica con su cuenta de Google y selecciona su perfil de 'Carlos Fitness Coach' en Google My Business. Luego, hace lo mismo con su página de Facebook. En minutos, el dashboard se puebla con sus reseñas existentes de ambas plataformas.
2. **Creación de una Automatización:** Carlos quiere capitalizar el éxito de su popular 'Reto de 60 días'. Navega a la sección de 'Automatizaciones' y crea una nueva regla:
* **Disparador (Trigger):** Selecciona 'Cliente completa un programa'.
* **Parámetro del Disparador:** Elige 'Reto de 60 días'.
* **Retraso (Delay):** Configura un retraso de '3 días' para dar tiempo al cliente a asimilar su logro.
* **Acción (Action):** Selecciona 'Enviar solicitud de reseña'.
* **Parámetros de la Acción:** Elige la plantilla de email '¡Felicidades por tu logro!' y selecciona 'Google' como la plataforma de reseña preferida. Guarda la automatización.
3. **Ejecución Automática:** Una de sus clientas, Laura, finaliza el 'Reto de 60 días'. El sistema de TrainerERP registra este evento. Tres días después, la automatización de Carlos se activa y envía a Laura un correo electrónico personalizado felicitándola y con un enlace directo para dejar una reseña en el perfil de Google de Carlos.
4. **Gestión de la Nueva Reseña:** Laura, encantada con sus resultados, deja una reseña de 5 estrellas. TrainerERP detecta la nueva reseña durante su sincronización periódica. Carlos recibe una notificación en su dashboard: '¡Nueva reseña de 5 estrellas de Laura P.!'.
5. **Capitalización del Testimonio:** Carlos entra al 'Review Engine' y ve la reseña de Laura. Le parece fantástica. Hace clic en el botón 'Crear Publicación Social'. Se abre un editor visual con varias plantillas de Instagram. Elige una que muestra una cita sobre un fondo con su logo. El texto de la reseña de Laura se inserta automáticamente. Carlos hace un pequeño ajuste y programa la publicación para el día siguiente a través del gestor de redes sociales de TrainerERP.
---
## Riesgos operativos y edge cases
* **Dependencia de APIs Externas:** La funcionalidad principal depende de las APIs de Google y Facebook. Un cambio en sus políticas, una caída del servicio o la deprecación de un endpoint puede romper la integración. **Mitigación:** Monitoreo constante, tener un plan de contingencia y comunicar claramente a los usuarios si una integración está temporalmente inactiva.
* **Gestión de Reseñas Negativas:** Una automatización podría solicitar una reseña a un cliente insatisfecho, generando una reseña negativa pública. **Mitigación:** Incluir una opción de 'feedback interno' en el email de solicitud. Por ejemplo, un primer paso que pregunte '¿Cómo calificarías tu experiencia?' Si la calificación es baja (1-3), se dirige al cliente a un formulario de feedback privado en lugar del enlace público de Google/Facebook.
* **Consentimiento y Privacidad (GDPR/CCPA):** Usar el nombre completo y la foto de un cliente en material de marketing puede requerir consentimiento explícito. **Mitigación:** Al crear una publicación social, el sistema debe advertir al entrenador y recomendar obtener permiso. Se puede incluir una funcionalidad para enviar una solicitud de consentimiento al cliente directamente desde la plataforma.
* **Sincronización de Múltiples Ubicaciones:** Un estudio con varias sedes tendrá múltiples perfiles de Google My Business. **Mitigación:** El sistema debe permitir al usuario conectar y gestionar varias ubicaciones, filtrando las reseñas por cada una de ellas.
---
## KPIs y qué significan
* **Puntuación media general:** Es el indicador de salud de la reputación del entrenador. Una tendencia a la baja puede indicar problemas en la calidad del servicio.
* **Tasa de conversión de solicitudes (%):** (Reseñas Recibidas / Solicitudes Enviadas) * 100. Este KPI mide la efectividad de las automatizaciones. Una tasa baja puede indicar que el timing, el canal (email/SMS) o el mensaje de la solicitud necesitan ajustes.
* **Tiempo medio de respuesta (Negativas):** Mide la rapidez con la que el entrenador gestiona las críticas. Un tiempo bajo demuestra un alto compromiso con la satisfacción del cliente y puede mitigar el impacto de una mala reseña.
* **Número de reseñas convertidas en contenido:** Cuantifica directamente el ROI de la herramienta en términos de generación de marketing. Ayuda al entrenador a ver cómo la prueba social se traduce en activos de marketing tangibles.
* **Distribución de Puntuaciones (Gráfico de barras):** Permite ver de un vistazo no solo la media, sino cuántas reseñas de 5, 4, 3, etc., estrellas hay. Un alto número de reseñas de 4 y 5 estrellas es un poderoso argumento de venta.
---
## Diagramas de Flujo (Mermaid)
**Flujo de Automatización de Solicitud de Reseña:**
mermaid
graph TD
A[Evento en el CRM: Cliente completa programa] --> B{Automatización activa?};
B -- Sí --> C[Esperar retraso configurado (e.g., 3 días)];
C --> D{Enviar solicitud por canal definido?};
D -- Email --> E[Enviar plantilla de email con enlace de reseña];
D -- SMS --> F[Enviar SMS con enlace de reseña];
B -- No --> G[Fin del proceso];
E --> H[Cliente hace clic y deja reseña en Google/FB];
F --> H;
H --> I[Sistema sincroniza y detecta nueva reseña];
I --> J[Notificar al Entrenador en el Dashboard de TrainerERP];
