# Hub de Contenidos & UGC

**Página padre:** Hola

---

# Hub de Contenidos & UGC
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta página es el centro de control para el 'Entrenador Personal' y 'Entrenador Asociado'. Desde aquí, gestionan todo el contenido generado por sus clientes, moderan envíos, solicitan permisos de uso y organizan su prueba social. Los 'Clientes' no acceden a esta interfaz directamente, pero interactúan con ella al enviar contenido o al responder a solicitudes de consentimiento.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/contenido/ugc-hub
## Descripción Funcional
El 'Hub de Contenidos & UGC' es una plataforma centralizada y potente diseñada para que los entrenadores personales capitalicen su activo de marketing más valioso: los resultados y la satisfacción de sus clientes. En lugar de tener testimonios, fotos de transformación y menciones en redes sociales dispersas, este hub las agrega en un único panel de control inteligente. El sistema monitoriza las redes sociales conectadas (como Instagram o TikTok) en busca de menciones y etiquetas de clientes, importándolas automáticamente a una cola de moderación. Además, los entrenadores pueden subir manualmente contenido que reciben por otros medios. La funcionalidad clave reside en la gestión del ciclo de vida del contenido: desde la detección o subida, pasando por un proceso de moderación donde el entrenador aprueba o rechaza el material, hasta la solicitud formal de consentimiento de uso. Este último paso es crucial para el cumplimiento legal, enviando al cliente una solicitud clara para utilizar su imagen o testimonio, y registrando su respuesta de forma segura. Una vez aprobado y con permiso, el contenido puede ser etiquetado, categorizado (ej: 'Pérdida de Grasa', 'Ganancia Muscular', 'Testimonio en Video') y organizado en galerías dinámicas, listas para ser insertadas en landing pages, emails o campañas de marketing directamente desde TrainerERP, convirtiendo el éxito de los clientes en una máquina de adquisición constante.
## Valor de Negocio
El valor de negocio del 'Hub de Contenidos & UGC' es inmenso para cualquier entrenador personal, ya que ataca directamente los pilares de la confianza y la conversión. En el nicho del fitness, la 'prueba social' no es un lujo, es una necesidad; los potenciales clientes no compran un servicio, compran una transformación. Este hub convierte los resultados de los clientes en activos de marketing reutilizables y de alto impacto. Automatiza el laborioso proceso de recopilar, solicitar permiso y organizar contenido, ahorrando al entrenador decenas de horas al mes. Más importante aún, mitiga riesgos legales al formalizar el proceso de consentimiento de uso de imagen, protegiendo al negocio. Al centralizar y facilitar el uso de testimonios auténticos y transformaciones visuales, aumenta drásticamente la tasa de conversión en landing pages y embudos de venta. También fomenta una comunidad más fuerte, ya que los clientes se sienten reconocidos y valorados al ver sus logros destacados, lo que a su vez mejora la retención. En resumen, esta herramienta transforma el éxito de los clientes pasados y presentes en el motor de crecimiento más potente y auténtico para el futuro del negocio del entrenador.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: media
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador, quiero conectar mi cuenta de Instagram para que TrainerERP detecte automáticamente cuando un cliente me etiqueta en una foto de su progreso, y así poder añadirla a mi colección de UGC.
- Como entrenador, quiero enviar una solicitud de permiso formal y rastreable a un cliente para usar su video de testimonio en mi página de ventas, asegurándome de tener su consentimiento por escrito.
- Como entrenador, quiero filtrar todo mi contenido aprobado por etiquetas como 'transformación de 12 semanas' o 'aumento de fuerza' para encontrar rápidamente el caso de éxito más relevante para un cliente potencial.
- Como entrenador, quiero tener una cola de moderación para revisar todo el contenido nuevo antes de que sea visible en cualquier galería, asegurando que solo se muestre material de alta calidad y que se alinee con mi marca.
- Como entrenador, quiero crear una galería de 'Lo Mejor de' con mis 10 mejores transformaciones y obtener un código simple para incrustarla directamente en mi landing page principal creada con TrainerERP.
- Como entrenador, quiero ver un resumen de cuántas solicitudes de consentimiento he enviado, cuántas han sido aceptadas y cuál es mi tasa de éxito para poder mejorar mi comunicación con los clientes.
## Acciones Clave
- Conectar/desconectar cuentas de redes sociales (Instagram, TikTok, Facebook).
- Ver y moderar la cola de contenido pendiente (Aprobar/Rechazar).
- Enviar solicitudes de consentimiento de uso de imagen a clientes específicos.
- Filtrar y buscar en la biblioteca de contenido por cliente, etiqueta, estado de consentimiento o fuente.
- Crear, editar y eliminar galerías de contenido para uso externo (widgets).
- Subir manualmente archivos de imagen o video.
- Etiquetar y categorizar piezas de contenido individuales o en lote.
## 🧩 Componentes React Sugeridos
### 1. UgcHubContainer
Tipo: container | Componente principal que orquesta toda la página. Realiza las llamadas a la API para obtener el contenido, gestiona los estados globales de la página (filtros, paginación) y pasa los datos a los componentes de presentación.
Props:
- trainerId: 
- string (requerido) - ID del entrenador actualmente logueado.
Estados: contentItems[], isLoading, error, activeFilters, pagination
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<UgcHubContainer trainerId={currentUser.id} />
```

### 2. ContentCard
Tipo: presentational | Muestra una única pieza de contenido UGC en una tarjeta. Incluye la imagen/video, información del cliente, estado de consentimiento, etiquetas y acciones rápidas (Aprobar, Rechazar, Pedir Permiso).
Props:
- content: 
- UgcContent (requerido) - Objeto con toda la información de la pieza de contenido.
- onApprove: 
- (id: string) => void (requerido) - Callback que se ejecuta al hacer clic en el botón 'Aprobar'.
- onReject: 
- (id: string) => void (requerido) - Callback que se ejecuta al hacer clic en el botón 'Rechazar'.
- onRequestConsent: 
- (id: string) => void (requerido) - Callback que abre el modal para solicitar consentimiento.
Dependencias: styled-components
Ejemplo de uso:
```typescript
<ContentCard content={item} onApprove={handleApprove} onReject={handleReject} onRequestConsent={handleRequest} />
```

### 3. ConsentRequestModal
Tipo: container | Modal que se abre para enviar una solicitud de consentimiento. Permite al entrenador personalizar el mensaje y previsualizar el email que se enviará al cliente.
Props:
- isOpen: 
- boolean (requerido) - Controla la visibilidad del modal.
- onClose: 
- () => void (requerido) - Función para cerrar el modal.
- contentId: 
- string (requerido) - ID del contenido para el cual se solicita el permiso.
- clientInfo: 
- { name: string; email: string; } (requerido) - Información del cliente para rellenar los campos.
Estados: message, isSending, sendSuccess, sendError
Dependencias: react-hook-form, axios
Ejemplo de uso:
```typescript
<ConsentRequestModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} contentId={selectedContent.id} clientInfo={selectedContent.client} />
```

### 4. useUgc
Tipo: hook | Custom hook para abstraer la lógica de fetching y mutación de datos relacionados con el UGC. Maneja el estado de carga, errores y caching con react-query.
Props:
- filters: 
- UgcFilters (opcional) - Objeto con los filtros a aplicar en la query.
Estados: Devuelve el estado de react-query: data, isLoading, isError, etc., Proporciona funciones de mutación: approveContent, rejectContent, etc.
Dependencias: react-query, axios
Ejemplo de uso:
```typescript
const { data: content, isLoading, approveContent } = useUgc({ status: 'pending_moderation' });
```
## 🔌 APIs Requeridas
### 1. GET /api/ugc/content
Obtiene una lista paginada de contenido UGC, con capacidad de filtrado por estado, etiquetas, cliente, etc.
Parámetros:
- page (
- number, query, opcional): Número de página para la paginación.
- limit (
- number, query, opcional): Número de elementos por página.
- status (
- string, query, opcional): Filtra por estado de moderación: 'pending_moderation', 'approved', 'rejected'.
- consent_status (
- string, query, opcional): Filtra por estado de consentimiento: 'granted', 'pending_response', etc.
Respuesta:
Tipo: object
Estructura: Objeto con un array 'data' de contenido UGC y un objeto 'pagination' con metadatos.
```json
{
  "data": [
    {
      "id": "ugc_123",
      "type": "image",
      "source_url": "https://instagram.com/p/CXYZ...",
      "storage_url": "https://cdn.trainererp.com/...",
      "status": "approved",
      "consent_status": "granted",
      "client": {
        "id": "client_456",
        "name": "Ana Pérez"
      },
      "tags": [
        "transformacion",
        "12-semanas"
      ],
      "created_at": "2023-10-27T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación no es válido o ha expirado.
- 400: 
- Bad Request - Parámetro de filtro no válido.

### 2. PATCH /api/ugc/content/{contentId}/status
Actualiza el estado de moderación de una pieza de contenido (ej: aprobar o rechazar).
Parámetros:
- contentId (
- string, path, requerido): ID del contenido a actualizar.
- status (
- string, body, requerido): El nuevo estado: 'approved' o 'rejected'.
Respuesta:
Tipo: object
Estructura: El objeto de contenido UGC actualizado.
```json
{
  "id": "ugc_123",
  "status": "approved",
  "message": "Content status updated successfully."
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El contentId proporcionado no existe.
- 403: 
- Forbidden - El entrenador no tiene permisos sobre este contenido.

### 3. POST /api/ugc/content/{contentId}/consent-request
Envía una solicitud de consentimiento al cliente asociado con una pieza de contenido.
Parámetros:
- contentId (
- string, path, requerido): ID del contenido para el que se solicita el consentimiento.
- custom_message (
- string, body, opcional): Mensaje personalizado opcional para incluir en el email de solicitud.
Respuesta:
Tipo: object
Estructura: Objeto de confirmación con el estado de la solicitud.
```json
{
  "request_id": "consent_req_789",
  "content_id": "ugc_123",
  "status": "pending_response",
  "message": "Consent request sent successfully to Ana Pérez."
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El contentId no existe o no tiene un cliente asociado.
- 409: 
- Conflict - Ya existe una solicitud de consentimiento pendiente para este contenido.

### 4. POST /api/ugc/social/sync
Dispara una sincronización manual para buscar nuevo contenido (menciones, etiquetas) en las redes sociales conectadas.
Respuesta:
Tipo: object
Estructura: Objeto que confirma el inicio de la tarea de sincronización.
```json
{
  "job_id": "sync_job_abc",
  "status": "queued",
  "message": "Social media content sync has been initiated."
}
```
Autenticación: Requerida
Errores posibles:
- 429: 
- Too Many Requests - La sincronización manual se ha solicitado demasiadas veces en un corto período de tiempo.
- 400: 
- Bad Request - No hay cuentas de redes sociales conectadas para este entrenador.
## Notas Técnicas
Colecciones backend: ugc_content (content_id, client_id, source_url, storage_url, type, status, consent_status, tags, created_at), clients (client_id, name, email, social_handles), consent_requests (request_id, content_id, client_id, status, token, expires_at, granted_at), social_connections (trainer_id, platform, access_token, refresh_token, expires_at)
KPIs visibles: Tasa de Aceptación de Consentimiento (Aceptados / Enviados), Contenido Pendiente de Moderación (Número total), Tiempo Medio de Aprobación de Contenido (Desde la detección hasta la aprobación), Nuevas Menciones Detectadas (Últimos 7 días), Distribución de Contenido por Etiqueta (Gráfico de Torta), Contenido más Utilizado en Campañas
## Documentación Completa
## Resumen
El **Hub de Contenidos & UGC (User-Generated Content)** es el centro de mando estratégico para la gestión de la prueba social en TrainerERP. Esta funcionalidad permite a los entrenadores personales y centros de fitness centralizar, moderar y legalizar el uso de todo el contenido generado por sus clientes, como fotos de transformación, videos de testimonios, reseñas y menciones en redes sociales. El objetivo principal es convertir los resultados de los clientes en potentes activos de marketing para atraer nuevos prospectos, construir una marca auténtica y aumentar las conversiones. El hub automatiza la recolección de contenido de plataformas como Instagram, facilita un flujo de trabajo de aprobación y, lo más importante, integra un sistema de solicitud de consentimiento para cumplir con las normativas de privacidad y uso de imagen. El contenido aprobado puede ser organizado con etiquetas y agrupado en galerías dinámicas que se pueden incrustar fácilmente en cualquier parte del ecosistema de marketing del entrenador (landing pages, emails, etc.) dentro de TrainerERP.
## Flujo paso a paso de uso real
1. **Conexión Inicial**: El Entrenador Alex navega a `/dashboard/contenido/ugc-hub` por primera vez. Se le pide conectar su cuenta de Instagram profesional. Alex autoriza a TrainerERP a leer las menciones y etiquetas de su cuenta.
2. **Detección Automática**: Una de sus clientas, Laura, publica una historia en Instagram mostrando su progreso de 6 semanas y etiqueta a @EntrenadorAlex. El sistema de TrainerERP detecta esta etiqueta.
3. **Cola de Moderación**: La historia de Laura aparece automáticamente en la sección "Pendiente de Moderación" del Hub de UGC. Alex ve una miniatura del video, el nombre de usuario de Laura y la fecha.
4. **Decisión y Solicitud de Permiso**: A Alex le encanta el video. En lugar de solo aprobarlo internamente, quiere usarlo en su página de "Resultados". Hace clic en la tarjeta de contenido y selecciona la acción "Solicitar Permiso".
5. **Envío de Solicitud**: Se abre un modal pre-rellenado con la información de Laura (ya que es su cliente en TrainerERP). Alex personaliza el mensaje: "¡Laura, increíble progreso! Me encantaría destacar tu video en mi web. ¿Te parecería bien?". Hace clic en "Enviar Solicitud".
6. **Interacción del Cliente**: Laura recibe un email profesional con el logo de Alex, el mensaje personalizado y un enlace. Al hacer clic, llega a una página simple donde puede ver su video, leer los términos de uso (ej. "Permito el uso en la web y redes sociales de @EntrenadorAlex") y hacer clic en un botón de "Acepto".
7. **Actualización de Estado**: Inmediatamente, en el Hub de UGC de Alex, el estado del video de Laura cambia de `pending_response` a `granted`. Una marca de verificación verde aparece en la tarjeta.
8. **Organización y Uso**: Alex ahora añade etiquetas al video: `transformacion`, `mujer`, `perdida-de-peso`. Luego, va a su sección de "Galerías", selecciona su galería "Transformaciones Web" y añade el video de Laura. Como esta galería ya está incrustada en su landing page, el video de Laura aparece automáticamente en su sitio web, actuando como una poderosa prueba social para nuevos visitantes.
## Riesgos operativos y edge cases
* **Revocación de Consentimiento**: Un cliente que previamente dio su consentimiento decide revocarlo. El sistema debe tener un mecanismo para que el cliente pueda hacerlo (ej. un enlace en el email original) y esto debe disparar una acción automática para eliminar el contenido de todas las galerías públicas y notificar al entrenador.
* **Contenido de Múltiples Personas**: Una foto o video incluye a varias personas. El consentimiento debe obtenerse de todas las personas identificables, lo cual complica el flujo. La política inicial debería ser manejar solo contenido donde el cliente es el único sujeto principal.
* **Expiración de Tokens de API**: Los permisos para acceder a las APIs de redes sociales (Instagram, etc.) expiran. El sistema debe manejar esto de forma elegante, notificando al entrenador que necesita volver a conectar su cuenta y pausando la sincronización hasta que se resuelva.
* **Clientes no identificados**: Un usuario etiqueta al entrenador, pero su `handle` de Instagram no coincide con ningún cliente en la base de datos de TrainerERP. Este contenido debe aparecer en moderación con un estado de "Cliente no identificado", permitiendo al entrenador asociarlo manualmente a un cliente existente o ignorarlo.
## KPIs y qué significan
* **Tasa de Aceptación de Consentimiento (%)**: `(Solicitudes Aceptadas / Solicitudes Enviadas) * 100`. Este es el KPI más importante. Una tasa alta (>80%) indica que la comunicación con los clientes es buena y que se sienten cómodos compartiendo su éxito. Una tasa baja podría indicar que el mensaje de solicitud es poco claro, impersonal o que los términos son demasiado amplios.
* **Contenido Pendiente de Moderación**: El número total de elementos esperando la revisión del entrenador. Un número constantemente alto puede ser un cuello de botella y significa que el entrenador está perdiendo oportunidades de usar contenido fresco. El objetivo es mantener este número bajo.
* **Tiempo Medio de Aprobación**: El tiempo que transcurre desde que un contenido es detectado hasta que el entrenador lo aprueba o rechaza. Un tiempo corto significa que el entrenador es ágil y puede capitalizar el momentum del contenido reciente.
* **Nuevas Menciones Detectadas**: Un indicador de la salud de la comunidad y del "boca a boca" digital. Un aumento en este número es una señal positiva de engagement.
* **Contenido más Utilizado**: Rastrea qué piezas de UGC se incluyen en más galerías o campañas. Esto ayuda al entrenador a identificar sus casos de éxito más potentes y reutilizarlos estratégicamente.
## Diagramas de Flujo (Mermaid)
**Diagrama de Secuencia: Flujo de Solicitud de Consentimiento**
mermaid
sequenceDiagram
participant Entrenador
participant TrainerERP_Backend as Backend
participant Cliente
Entrenador->>Backend: POST /api/ugc/content/{id}/consent-request
activate Backend
Backend-->>Entrenador: 200 OK (Solicitud encolada)
deactivate Backend
Backend->>Cliente: Envía Email con enlace de consentimiento único
activate Cliente
Cliente->>Cliente: Abre el email y hace clic en el enlace
Cliente-->>Backend: GET /consent/{token}
activate Backend
Backend-->>Cliente: Devuelve página de consentimiento con detalles
deactivate Backend
Cliente->>Cliente: Lee los términos y hace clic en "Aceptar"
Cliente-->>Backend: POST /consent/{token}/accept
activate Backend
Backend->>Backend: Actualiza BD: ugc_content.consent_status = 'granted'
Backend-->>Cliente: 200 OK (Página de agradecimiento)
deactivate Backend
deactivate Cliente
Note over Entrenador,Backend: El Hub de UGC se actualiza en tiempo real (vía WebSocket o polling)
Backend-->>Entrenador: Notificación/Actualización UI: "El consentimiento de Laura ha sido otorgado"
