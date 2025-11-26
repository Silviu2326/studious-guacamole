# Retargeting & Pixel Manager

**Página padre:** Hola

---

# Retargeting & Pixel Manager
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado (con permisos)
Esta funcionalidad está diseñada para el propietario del negocio o el encargado de marketing (Entrenador Administrador). Permite gestionar herramientas avanzadas de publicidad. Un 'Entrenador Asociado' podría tener acceso de solo lectura o necesitar permisos explícitos para modificar la configuración, ya que una configuración incorrecta puede afectar a todas las campañas de marketing.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/marketing/retargeting
## Descripción Funcional
El 'Retargeting & Pixel Manager' es el centro de control de TrainerERP para la publicidad de pago y el seguimiento de visitantes. Esta página desmitifica la tecnología de los píxeles de seguimiento (como el Pixel de Facebook o el Tag de Google) y la pone al alcance de cualquier entrenador personal, sin necesidad de conocimientos técnicos. Desde aquí, el entrenador puede instalar, gestionar y verificar sus píxeles de seguimiento en todas sus páginas públicas generadas con TrainerERP, como landing pages de retos, páginas de venta de programas de entrenamiento o formularios de agendamiento de consultas. La funcionalidad principal es permitir el 'retargeting', una estrategia de marketing increíblemente poderosa que consiste en mostrar anuncios específicos a personas que ya han visitado tu sitio web. Por ejemplo, si un potencial cliente vio tu programa 'Transformación en 90 días' pero no se inscribió, puedes crear una campaña en Facebook que le muestre anuncios con testimonios de éxito de ese mismo programa, recordándole el valor y animándole a dar el paso. Esta herramienta facilita la creación de estas 'audiencias' de retargeting y la configuración de 'eventos' personalizados (como 'Vio un plan', 'Inició el proceso de pago', 'Agendó una llamada') para segmentar a los visitantes según su nivel de interés y comportamiento.
## Valor de Negocio
El valor de negocio de esta funcionalidad es inmenso y directo, ya que transforma el gasto publicitario de una apuesta a una inversión estratégica con un ROI medible. Para un entrenador personal, cada visitante a su web es un cliente potencial valioso. Perderlo después de una única visita es un coste de oportunidad enorme. El 'Retargeting & Pixel Manager' permite recuperar a esos visitantes indecisos y convertirlos en clientes de pago. Al re-impactar a una audiencia 'caliente' que ya conoce la marca, el coste de adquisición de clientes (CAC) se reduce drásticamente en comparación con la publicidad dirigida a audiencias 'frías'. Permite a los entrenadores construir un embudo de ventas profesional y automatizado, nutriendo a los leads a lo largo de su viaje de decisión. En lugar de depender únicamente del tráfico orgánico o de referidos, los entrenadores pueden crear un flujo constante y predecible de clientes, lo que les permite escalar su negocio. Esta herramienta nivela el campo de juego, dando a los entrenadores independientes las mismas capacidades de marketing que antes estaban reservadas para grandes empresas con equipos de marketing dedicados.
## Prioridad / Roadmap
- Impacto: medio
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero poder pegar mi ID de Pixel de Facebook en un solo campo y que TrainerERP se encargue de instalarlo en todas mis páginas para empezar a rastrear visitantes sin tocar código.
- Como coach online, quiero crear una audiencia personalizada de personas que añadieron mi 'Plan Nutricional Avanzado' al carrito pero no completaron la compra, para mostrarles un anuncio con un descuento por tiempo limitado.
- Como dueño de un estudio de fitness, quiero ver un panel simple que me confirme que mi pixel está 'Activo' y recibiendo datos, para tener la tranquilidad de que mis campañas de retargeting están funcionando correctamente.
- Como entrenador que vende programas grupales, quiero definir un evento personalizado llamado 'VioPaginaReto' que se dispare cuando alguien visita la landing page de mi próximo reto, para poder medir el interés y crear una audiencia específica.
- Como profesional del fitness, quiero que el sistema me sugiera automáticamente audiencias comunes, como 'Visitantes de los últimos 30 días' o 'Personas que vieron la página de contacto', para poder lanzar mi primera campaña de retargeting rápidamente.
## Acciones Clave
- Añadir un nuevo pixel de seguimiento (Facebook, Google, etc.) introduciendo el ID.
- Activar o desactivar un pixel existente con un solo clic.
- Verificar el estado de conexión del pixel (ej: 'Activo, último evento hace 2 minutos').
- Crear un evento de conversión personalizado basado en la visita a una URL específica (ej: página de 'gracias por agendar').
- Visualizar una lista de eventos estándar recomendados para entrenadores (ej: 'ViewContent' para planes, 'Lead' para formularios) y activarlos.
- Acceder a un enlace directo a las guías de las plataformas publicitarias (Facebook/Google) sobre cómo crear audiencias personalizadas con los datos recopilados.
## 🧩 Componentes React Sugeridos
### 1. PixelManagerDashboard
Tipo: container | Componente principal que orquesta la página. Obtiene la lista de píxeles configurados, gestiona el estado de la UI (modales, cargas) y maneja las acciones principales como añadir o eliminar un píxel.
Props:
- trainerId: 
- string (requerido) - ID del entrenador para obtener sus configuraciones específicas.
Estados: pixels: Pixel[], isLoading: boolean, error: string | null, isAddPixelModalOpen: boolean
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<PixelManagerDashboard trainerId='trainer_123' />
```

### 2. PixelCard
Tipo: presentational | Muestra la información de un único píxel (ej. Facebook Pixel). Incluye el nombre, el estado, la última actividad y un interruptor para activarlo/desactivarlo. También contiene botones para editar o eliminar.
Props:
- pixel: 
- { id: string; platform: 'facebook' | 'google'; pixelId: string; isActive: boolean; lastEventTimestamp?: string; } (requerido) - Objeto con los datos del píxel a mostrar.
- onToggleStatus: 
- (pixelId: string, newStatus: boolean) => void (requerido) - Función callback que se ejecuta al cambiar el interruptor de estado.
- onDelete: 
- (pixelId: string) => void (requerido) - Función callback para eliminar el píxel.
Ejemplo de uso:
```typescript
<PixelCard pixel={fbPixel} onToggleStatus={handleToggle} onDelete={handleDelete} />
```

### 3. AddPixelModal
Tipo: presentational | Modal que contiene un formulario para añadir un nuevo píxel. Permite al usuario seleccionar la plataforma (Facebook, Google) e introducir el ID correspondiente.
Props:
- isOpen: 
- boolean (requerido) - Controla la visibilidad del modal.
- onClose: 
- () => void (requerido) - Función para cerrar el modal.
- onSubmit: 
- (data: { platform: string; pixelId: string; }) => Promise<void> (requerido) - Función que se ejecuta al enviar el formulario con los datos del nuevo píxel.
Estados: selectedPlatform: string, pixelIdInput: string, isSubmitting: boolean
Dependencias: react-hook-form
Ejemplo de uso:
```typescript
<AddPixelModal isOpen={isModalOpen} onClose={closeModal} onSubmit={addNewPixel} />
```

### 4. usePixelHealthCheck
Tipo: hook | Hook personalizado que encapsula la lógica para verificar el estado de un píxel. Puede hacer una llamada a un endpoint que reporte la última actividad del píxel.
Props:
- pixelId: 
- string (requerido) - El ID del píxel en nuestra base de datos para verificar.
Estados: status: 'active' | 'inactive' | 'error' | 'loading', lastEvent: Date | null
Ejemplo de uso:
```typescript
const { status, lastEvent } = usePixelHealthCheck('px_abc');
```
## 🔌 APIs Requeridas
### 1. GET /api/v1/marketing/pixels
Obtiene la lista de todos los píxeles de seguimiento configurados para la cuenta del entrenador autenticado.
Respuesta:
Tipo: array
Estructura: Un array de objetos, donde cada objeto representa un píxel configurado.
```json
[
  {
    "id": "px_12345",
    "platform": "facebook",
    "pixelId": "123456789012345",
    "isActive": true,
    "createdAt": "2023-10-27T10:00:00Z",
    "lastEventTimestamp": "2023-10-27T14:30:00Z"
  }
]
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación no es válido o no se ha proporcionado.

### 2. POST /api/v1/marketing/pixels
Añade un nuevo píxel de seguimiento a la cuenta del entrenador.
Parámetros:
- platform (
- string ('facebook' | 'google_analytics' | 'gtm'), body, requerido): La plataforma publicitaria a la que pertenece el píxel.
- pixelId (
- string, body, requerido): El identificador único del píxel proporcionado por la plataforma.
Respuesta:
Tipo: object
Estructura: El objeto del píxel recién creado.
```json
{
  "id": "px_67890",
  "platform": "facebook",
  "pixelId": "098765432109876",
  "isActive": true,
  "createdAt": "2023-10-27T15:00:00Z",
  "lastEventTimestamp": null
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - El `pixelId` tiene un formato incorrecto o la `platform` no es válida.
- 409: 
- Conflict - Este píxel ya ha sido añadido a la cuenta.

### 3. PATCH /api/v1/marketing/pixels/{pixelId}
Actualiza la configuración de un píxel existente, como su estado de activación.
Parámetros:
- pixelId (
- string, path, requerido): El ID del píxel a actualizar (el ID interno de TrainerERP).
- isActive (
- boolean, body, requerido): El nuevo estado de activación del píxel.
Respuesta:
Tipo: object
Estructura: El objeto del píxel actualizado.
```json
{
  "id": "px_12345",
  "platform": "facebook",
  "pixelId": "123456789012345",
  "isActive": false,
  "createdAt": "2023-10-27T10:00:00Z",
  "lastEventTimestamp": "2023-10-27T14:30:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ningún píxel con el ID proporcionado.

### 4. DELETE /api/v1/marketing/pixels/{pixelId}
Elimina un píxel de seguimiento de la cuenta del entrenador.
Parámetros:
- pixelId (
- string, path, requerido): El ID del píxel a eliminar (el ID interno de TrainerERP).
Respuesta:
Tipo: object
Estructura: Un objeto de confirmación.
```json
{
  "message": "Pixel deleted successfully."
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ningún píxel con el ID proporcionado.

### 5. GET /api/v1/marketing/audiences/suggestions
Obtiene una lista de audiencias de retargeting sugeridas basadas en el tráfico y los eventos del sitio del entrenador.
Respuesta:
Tipo: array
Estructura: Un array de objetos, donde cada objeto es una sugerencia de audiencia.
```json
[
  {
    "id": "sug_01",
    "name": "Visitantes de la página de precios (últimos 30 días)",
    "description": "Personas que han mostrado interés en tus precios pero no han comprado. Ideal para anuncios de oferta o testimonios.",
    "criteria": {
      "type": "URL_VISIT",
      "path": "/pricing"
    }
  },
  {
    "id": "sug_02",
    "name": "Abandono de inscripción a reto (últimos 7 días)",
    "description": "Personas que iniciaron la inscripción a tu último reto pero no la completaron.",
    "criteria": {
      "type": "EVENT_SEQUENCE",
      "sequence": [
        "begin_checkout",
        "!purchase"
      ]
    }
  }
]
```
Autenticación: Requerida
## Notas Técnicas
Colecciones backend: trainers, marketing_pixels, pixel_events_log, suggested_audiences
KPIs visibles: Estado del Pixel (Activo / Inactivo / Error), Número total de eventos recibidos (últimas 24h / 7 días), Última actividad detectada (ej: 'hace 5 minutos'), Top 5 eventos más frecuentes (ej: PageView, ViewContent, Lead), Número de audiencias sugeridas por el sistema, Tasa de coincidencia (si se usa Conversions API)
## Documentación Completa
## Resumen
El **Retargeting & Pixel Manager** es una de las herramientas de marketing más potentes dentro de TrainerERP. Su objetivo es simple: ayudar a los entrenadores a convertir a más visitantes de su sitio web en clientes de pago. Esto se logra mediante la tecnología de "píxeles de seguimiento", pequeños fragmentos de código que nos permiten entender cómo interactúan los visitantes con tus páginas y, lo más importante, nos permiten mostrarles anuncios relevantes más tarde en plataformas como Facebook, Instagram y Google.
En esencia, esta funcionalidad te permite 'seguir' a los visitantes interesados y recordarles tu oferta de valor. Si alguien visita tu página sobre un programa de pérdida de peso pero no se registra, no es un cliente perdido para siempre. Con el retargeting, puedes mostrarle anuncios con historias de éxito de ese programa durante los siguientes días, aumentando drásticamente las posibilidades de que regrese y se convierta en cliente. Esta página elimina toda la complejidad técnica de este proceso, permitiéndote activar esta potente estrategia con unos pocos clics.
## Flujo paso a paso de uso real
Imaginemos a Ana, una entrenadora personal que usa TrainerERP para gestionar su negocio online.
1. **Instalación del Pixel**: Ana quiere lanzar su primera campaña de retargeting. Navega a `Marketing > Retargeting & Pixel Manager` en su dashboard de TrainerERP. La pantalla le da la bienvenida y le explica brevemente qué es un pixel.
2. Ana ya ha creado su cuenta de Facebook Business y tiene su ID de Pixel. Hace clic en "Añadir Nuevo Pixel".
3. En el modal, selecciona "Facebook Pixel" y pega el ID (ej: `123456789012345`) en el campo correspondiente. El sistema valida que el formato es correcto.
4. Hace clic en "Guardar y Activar". Un indicador de carga aparece y, en segundos, una tarjeta de "Facebook Pixel" aparece en su dashboard con el estado "Activo". Ahora, TrainerERP inyectará automáticamente el script de este pixel en todas las páginas públicas de Ana (su biografía, sus páginas de venta de planes, su calendario de reservas, etc.), siempre respetando el consentimiento de cookies del visitante.
5. **Verificación**: Para asegurarse de que todo funciona, Ana abre una ventana de incógnito y visita la página de su programa "Reto Bikini 30 Días".
6. Vuelve al dashboard de TrainerERP y refresca la página. En la tarjeta del pixel, ahora ve: "Estado: Activo - Último evento recibido: hace unos segundos". Ana sonríe, sabe que está funcionando.
7. **Creación de Audiencias y Campañas (fuera de TrainerERP)**: Ahora que los datos fluyen, Ana va a su Administrador de Anuncios de Facebook.
8. Crea una nueva "Audiencia Personalizada" basada en "Tráfico del sitio web".
9. Define la regla: "Personas que visitaron páginas web específicas" y pone la URL de su "Reto Bikini 30 Días". Nombra a esta audiencia "Visitantes del Reto Bikini - 30 días".
10. **Lanzamiento de Campaña**: Ana crea una nueva campaña de anuncios en Facebook. En la sección de audiencia, en lugar de segmentar por intereses, selecciona la audiencia personalizada "Visitantes del Reto Bikini - 30 días".
11. Diseña un anuncio simple con un testimonio en video de una clienta satisfecha con ese reto y un texto que dice: "¿Aún pensando en unirte al reto? ¡Mira lo que logró María! Quedan pocas plazas."
Ahora, cualquier persona que visite la página del reto de Ana pero no se inscriba, comenzará a ver este anuncio en su feed de Facebook e Instagram, recordándole la oportunidad y empujándole a tomar la decisión final.
## Riesgos operativos y edge cases
- **Consentimiento de Cookies (GDPR/CCPA)**: Este es el mayor riesgo. El sistema DEBE integrarse con un banner de consentimiento. Si el visitante no acepta las cookies de marketing/analítica, el pixel no puede ni debe ser cargado. Esto puede llevar a que los entrenadores vean menos datos de los esperados y es crucial educarlos al respecto.
- **Ad Blockers**: Una parte de los usuarios utiliza bloqueadores que impiden que los píxeles funcionen. Esto es inevitable. La plataforma debe mostrar un aviso informativo explicando que los datos recopilados pueden no representar el 100% del tráfico real.
- **Atribución Multiplataforma**: Un usuario puede ver un anuncio en Instagram (Facebook Pixel), luego buscar en Google (Google Tag) y finalmente convertir. La atribución se vuelve compleja. Debemos ser claros en que TrainerERP facilita la recolección de datos, pero el análisis de atribución profundo se realiza en las plataformas publicitarias.
- **ID de Pixel Incorrecto**: Si un entrenador introduce por error el ID de otro negocio, sus datos de tráfico se enviarán a una cuenta publicitaria incorrecta. La validación de formato es el primer paso, pero no previene este error humano. La UI debe tener advertencias claras: "Asegúrate de que este ID es correcto y pertenece a tu cuenta."
## KPIs y qué significan
- **Estado del Pixel (Activo/Inactivo)**: Es el indicador de salud más básico. Verde significa que estamos enviando datos a Facebook/Google. Rojo significa que hay un problema y tus campañas de retargeting no funcionarán.
- **Eventos Recibidos (últimas 24h)**: Este número te confirma que el pixel está registrando la actividad de los visitantes. Si es 0 durante un día con tráfico, algo está mal. Es una métrica de diagnóstico.
- **Top 5 Eventos Frecuentes**: Te da una idea rápida de lo que hacen tus visitantes. Si `ViewContent` (ver un plan de entrenamiento) es alto pero `Lead` (rellenar un formulario) es bajo, podrías tener un problema en tu página de venta o en el formulario de contacto.
- **Audiencias Sugeridas**: Son atajos creados por TrainerERP para ti. En lugar de que tengas que pensar qué audiencias crear, te proponemos las más efectivas para entrenadores: "Visitantes de la web", "Visitantes de páginas de precios", "Personas que iniciaron un pago".
## Diagramas de Flujo (Mermaid)
mermaid
sequenceDiagram
participant Visitante
participant PaginaTrainerERP
participant ServidorTrainerERP
participant Facebook
Visitante->>PaginaTrainerERP: Visita una página (ej: /programa-fuerza)
PaginaTrainerERP->>Visitante: Muestra Banner de Consentimiento de Cookies
Visitante->>PaginaTrainerERP: Acepta cookies de marketing
PaginaTrainerERP->>ServidorTrainerERP: Solicita script del pixel del entrenador
ServidorTrainerERP-->>PaginaTrainerERP: Devuelve script con el Pixel ID correcto
PaginaTrainerERP->>Facebook: El script se ejecuta y envía evento 'PageView'
Facebook-->>PaginaTrainerERP: Responde 200 OK
Note right of Visitante: El visitante ahora está en la audiencia de 'retargeting'.
