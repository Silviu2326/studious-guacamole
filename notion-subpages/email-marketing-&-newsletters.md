# Email Marketing & Newsletters

**Página padre:** Hola

---

# Email Marketing & Newsletters
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad es una herramienta de gestión clave para los roles de 'Entrenador Personal (Administrador)' y 'Entrenador Asociado'. El Administrador tiene acceso completo a todas las funcionalidades: crear, editar, eliminar campañas, gestionar todas las listas de contactos y ver analíticas globales. El 'Entrenador Asociado' puede tener permisos restringidos, como solo poder crear campañas para sus clientes asignados y ver las analíticas de sus propios envíos, pero no puede eliminar plantillas o segmentos globales.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/marketing/email-campaigns
## Descripción Funcional
La página de 'Email Marketing & Newsletters' es el centro de control de comunicaciones para cualquier entrenador personal que use TrainerERP. Está diseñada para reemplazar herramientas externas como Mailchimp o ActiveCampaign, integrando la potencia del email marketing directamente con los datos de clientes, planes y actividad del entrenador. Desde esta interfaz, los entrenadores pueden diseñar campañas de email visualmente atractivas utilizando un editor de arrastrar y soltar y plantillas pre-diseñadas específicamente para el nicho de fitness: anuncios de nuevos programas de entrenamiento, newsletters mensuales con consejos de nutrición, promociones de retos de 30 días o historias de éxito de clientes. La funcionalidad clave reside en su profunda integración con el CRM del sistema. Los entrenadores pueden crear segmentos dinámicos basados en el comportamiento del cliente, como 'clientes que no han agendado una sesión en 30 días', 'clientes del plan premium' o 'leads que descargaron la guía de nutrición'. Esto permite una comunicación ultra-personalizada y relevante. Además, la plataforma gestiona todo el ciclo de vida de la campaña: desde la creación y programación hasta el seguimiento post-envío con analíticas detalladas sobre tasas de apertura, clics, rebotes y, lo más importante, conversiones directas como la compra de un nuevo plan de entrenamiento a través de un enlace en el email.
## Valor de Negocio
El valor de negocio de la plataforma integrada de Email Marketing es inmenso para el entrenador personal. En primer lugar, centraliza una función de marketing crítica, ahorrando tiempo y dinero que de otro modo se gastaría en suscripciones a servicios de terceros y en la compleja tarea de sincronizar contactos. Al estar integrado, permite una segmentación y personalización que las herramientas genéricas no pueden ofrecer 'out-of-the-box'. Un entrenador puede automatizar una campaña de 'recuperación' para clientes en riesgo de abandono, o una campaña de 'upsell' a aquellos que han alcanzado un hito en su progreso, todo basado en datos que ya residen en TrainerERP. Esto no solo mejora la eficiencia operativa, sino que impacta directamente en los ingresos al potenciar la retención de clientes y la venta de servicios adicionales. Fomenta una relación más fuerte y profesional con los clientes, aportando valor constante a través de newsletters y comunicaciones relevantes, lo que posiciona al entrenador como una autoridad en su campo y construye una comunidad leal, reduciendo la dependencia de la captación constante de nuevos clientes.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: media
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero crear y enviar una newsletter mensual con consejos de nutrición, un 'cliente destacado' y próximos eventos para mantener a mi comunidad comprometida y aportar valor continuo.
- Como dueño de un estudio, quiero segmentar mi lista de contactos para enviar una oferta de un nuevo bootcamp de alta intensidad solo a los clientes que hayan asistido a clases similares en el pasado, para maximizar la tasa de conversión.
- Como entrenador online, quiero diseñar una secuencia de email de bienvenida automática para los nuevos leads que se suscriben a mi blog, para nutrirlos con contenido valioso y guiarlos hacia la compra de mi programa de iniciación.
- Como entrenador, quiero acceder a un panel de control simple que me muestre la tasa de apertura y la tasa de clics de mis campañas, para entender qué asuntos y qué tipo de contenido resuenan más con mis clientes.
- Como entrenador con poco tiempo, quiero usar plantillas de email pre-diseñadas para 'Anuncio de Nuevo Reto', 'Oferta de Temporada' o 'Recopilación de Recetas Saludables' para crear campañas profesionales en minutos sin necesidad de conocimientos de diseño.
## Acciones Clave
- Crear Nueva Campaña de Email
- Gestionar Listas y Segmentos de Contactos
- Ver Reportes y Analíticas de Campañas
- Explorar y Personalizar Plantillas de Email
- Programar o Enviar una Campaña Inmediatamente
- Configurar una Automatización de Email (ej: Secuencia de Bienvenida)
## 🧩 Componentes React Sugeridos
### 1. CampaignBuilderContainer
Tipo: container | Componente principal que gestiona el estado y la lógica para crear o editar una campaña de email. Orquesta los pasos del proceso: configuración, diseño, selección de audiencia y programación.
Props:
- campaignId: 
- string | null (opcional) - ID de la campaña a editar. Si es nulo, se crea una nueva.
Estados: currentStep ('setup' | 'design' | 'audience' | 'schedule'), campaignData (asunto, nombre, contenido HTML, etc.), selectedSegmentId, scheduleDate, isSaving
Dependencias: axios, react-router-dom
Ejemplo de uso:
```typescript
<CampaignBuilderContainer campaignId='camp_12345' />
```

### 2. EmailEditor
Tipo: presentational | Un editor visual de arrastrar y soltar para componer el cuerpo del email. Utiliza plantillas y bloques predefinidos (título, texto, imagen, botón, separador) específicos para entrenadores.
Props:
- initialContent: 
- string (requerido) - Contenido HTML inicial para cargar en el editor.
- onContentChange: 
- (newContent: string) => void (requerido) - Callback que se ejecuta cada vez que el contenido del email cambia.
- templateLibrary: 
- Array<{id: string, name: string, thumbnailUrl: string}> (requerido) - Lista de plantillas disponibles para seleccionar.
Estados: editorState (estructura interna del contenido)
Dependencias: unlayer/react-email-editor, styled-components
Ejemplo de uso:
```typescript
<EmailEditor initialContent={campaign.html} onContentChange={handleUpdate} templateLibrary={templates} />
```

### 3. SegmentSelector
Tipo: presentational | Componente de UI que permite al entrenador seleccionar una lista o segmento de contactos existente, o crear uno nuevo basado en reglas dinámicas (ej: 'Clientes con tag: VIP').
Props:
- segments: 
- Array<{id: string, name: string, contactCount: number}> (requerido) - Lista de segmentos disponibles para seleccionar.
- selectedSegmentId: 
- string | null (requerido) - El ID del segmento actualmente seleccionado.
- onSegmentSelect: 
- (segmentId: string) => void (requerido) - Callback que se ejecuta cuando se selecciona un segmento.
Estados: isCreatingNewSegment (modal state)
Dependencias: @headlessui/react
Ejemplo de uso:
```typescript
<SegmentSelector segments={availableSegments} selectedSegmentId={currentSegment} onSegmentSelect={setSegment} />
```

### 4. useCampaignAnalytics
Tipo: hook | Hook personalizado para obtener y gestionar los datos de analíticas de una campaña específica. Maneja estados de carga y error.
Props:
- campaignId: 
- string (requerido) - ID de la campaña para la cual obtener las analíticas.
Estados: analyticsData (objeto con KPIs), isLoading, error
Dependencias: swr
Ejemplo de uso:
```typescript
const { data, isLoading } = useCampaignAnalytics('camp_12345');
```
## 🔌 APIs Requeridas
### 1. POST /api/marketing/campaigns
Crea una nueva campaña de email. La guarda en estado 'draft'.
Parámetros:
- campaignData (
- object, body, requerido): Objeto con los detalles de la campaña.
Respuesta:
Tipo: object
Estructura: El objeto de la campaña recién creada, incluyendo su nuevo ID.
```json
{
  "id": "camp_a1b2c3d4",
  "name": "Lanzamiento Reto Verano",
  "subject": "💪 ¿Listo para tu mejor versión este verano?",
  "status": "draft",
  "created_at": "2023-10-27T10:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Faltan campos requeridos como 'name' o 'subject'.
- 403: 
- Forbidden - El usuario (ej: Entrenador Asociado) no tiene permisos para crear campañas.

### 2. GET /api/marketing/campaigns
Obtiene una lista paginada de todas las campañas de email del entrenador.
Parámetros:
- page (
- number, query, opcional): Número de página para la paginación.
- limit (
- number, query, opcional): Número de resultados por página.
- status (
- string, query, opcional): Filtra las campañas por estado (draft, scheduled, sent).
Respuesta:
Tipo: object
Estructura: Un objeto con la lista de campañas y metadatos de paginación.
```json
{
  "data": [
    {
      "id": "camp_a1b2c3d4",
      "name": "Lanzamiento Reto Verano",
      "subject": "💪 ¿Listo para tu mejor versión este verano?",
      "status": "sent",
      "sent_at": "2023-06-01T08:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```
Autenticación: Requerida

### 3. POST /api/marketing/campaigns/{campaignId}/schedule
Programa el envío de una campaña que está en estado 'draft'.
Parámetros:
- campaignId (
- string, path, requerido): ID de la campaña a programar.
- schedule_at (
- string, body, opcional): Fecha y hora en formato ISO 8601 para el envío. Si es nulo, se envía inmediatamente.
Respuesta:
Tipo: object
Estructura: El objeto de la campaña actualizado con el estado 'scheduled' o 'sending'.
```json
{
  "id": "camp_a1b2c3d4",
  "status": "scheduled",
  "schedule_at": "2023-11-01T09:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El campaignId no existe.
- 409: 
- Conflict - La campaña no está en estado 'draft' y no se puede programar.

### 4. GET /api/marketing/campaigns/{campaignId}/analytics
Obtiene las estadísticas de rendimiento de una campaña ya enviada.
Parámetros:
- campaignId (
- string, path, requerido): ID de la campaña de la cual se quieren las analíticas.
Respuesta:
Tipo: object
Estructura: Un objeto con los KPIs clave de la campaña.
```json
{
  "campaign_id": "camp_a1b2c3d4",
  "total_sent": 500,
  "opens": {
    "total": 250,
    "rate": 0.5
  },
  "clicks": {
    "total": 100,
    "rate": 0.2
  },
  "bounces": {
    "total": 5,
    "rate": 0.01
  },
  "unsubscribes": {
    "total": 2,
    "rate": 0.004
  }
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El campaignId no existe.
- 422: 
- Unprocessable Entity - La campaña aún no ha sido enviada, por lo que no hay analíticas disponibles.
## Notas Técnicas
Colecciones backend: Campaigns (subject, body_html, status, scheduled_at, segment_id), EmailTemplates (name, body_html, thumbnail_url), Segments (name, rules: [{field, operator, value}]), CampaignAnalytics (campaign_id, contact_id, sent_at, opened_at, clicked_links: [string]), Contacts (email, first_name, last_name, subscription_status, tags)
KPIs visibles: Tasa de Apertura (%), Tasa de Clics (CTR) (%), Tasa de Bajas (Unsubscribe Rate) (%), Tasa de Rebote (Bounce Rate) (%), Conversiones (Nº de planes comprados / inscripciones a retos), Total de Emails Enviados
## Documentación Completa
## Resumen
El módulo de 'Email Marketing & Newsletters' es una funcionalidad central de **TrainerERP** diseñada para empoderar a los entrenadores personales con herramientas de comunicación y marketing de nivel profesional, totalmente integradas en su ecosistema de gestión. Su propósito es eliminar la necesidad de herramientas de email marketing externas, costosas y desconectadas, centralizando la comunicación con clientes y leads. Esto permite a los entrenadores no solo enviar newsletters y promociones, sino también aprovechar los datos ricos de su CRM para crear campañas altamente personalizadas y automatizadas que impulsen la retención, generen nuevas ventas y construyan una comunidad sólida y comprometida. La plataforma abarca todo el proceso: desde la creación de emails con un editor visual y plantillas especializadas en fitness, pasando por la segmentación avanzada de la audiencia, hasta la programación, envío y análisis detallado del rendimiento de cada campaña.
## Flujo paso a paso de uso real
Imaginemos a **Laura, una entrenadora personal online** que quiere lanzar un nuevo 'Programa de Fuerza de 8 Semanas'.
1. **Inicio y Selección de Plantilla**: Laura navega a `Marketing > Email Campaigns` en su dashboard de TrainerERP y hace clic en 'Crear Nueva Campaña'. En la galería de plantillas, elige una llamada 'Lanzamiento de Nuevo Programa', que ya tiene una estructura visual atractiva con secciones para describir el programa, mostrar testimonios y un claro llamado a la acción.
2. **Diseño y Personalización**: Usando el editor de arrastrar y soltar, Laura personaliza la plantilla. Cambia el texto para describir los beneficios de su nuevo programa, sube un video corto de ella explicando los ejercicios y añade una foto de la transformación de un cliente anterior. Modifica el botón principal para que diga '¡Quiero Apuntarme Ahora!' y lo enlaza directamente a la página de pago del programa dentro de TrainerERP.
3. **Segmentación Inteligente**: En el paso de 'Audiencia', en lugar de enviar el email a toda su lista, Laura quiere dirigirse a los más interesados. Hace clic en 'Crear Nuevo Segmento' y define las siguientes reglas: `(Estado del Cliente es 'Activo') Y (Ha comprado un plan en los últimos 6 meses) Y (Su objetivo registrado es 'Ganar Fuerza')`. El sistema le muestra que este segmento contiene 78 clientes altamente cualificados.
4. **Programación y Envío**: Laura está satisfecha con el diseño y la audiencia. En el paso final, decide programar el email para que se envíe el próximo lunes a las 7:00 AM, sabiendo que es cuando sus clientes suelen revisar sus correos antes de empezar el día. Confirma la programación.
5. **Análisis de Resultados**: El martes, Laura vuelve a la página de campañas. Ve su campaña 'Lanzamiento Programa de Fuerza' con el estado 'Enviada'. Al hacer clic, accede al informe de analíticas. Observa una **tasa de apertura del 65%** (¡excelente!) y una **tasa de clics del 30%** en el botón de inscripción. Lo más importante, la sección de 'Conversiones' le muestra que **12 de los 78 clientes ya han comprado el nuevo programa**, generando ingresos directamente atribuibles a esa campaña de email. Con estos datos, decide programar un email de recordatorio una semana después solo para los que abrieron el email pero no hicieron clic.
## Riesgos operativos y edge cases
- **Cumplimiento Legal (GDPR/CAN-SPAM)**: Es el riesgo más crítico. El sistema debe garantizar que los enlaces de baja funcionen instantáneamente y de forma global. El consentimiento de marketing debe gestionarse de forma explícita (opt-in). Enviar emails a contactos sin consentimiento puede acarrear multas severas.
- **Reputación del Dominio y Entregabilidad**: Envíos masivos pueden hacer que los proveedores de email (Gmail, Outlook) marquen nuestro dominio como spam. Es crucial implementar buenas prácticas como DKIM, SPF, DMARC, calentar las IPs de envío gradualmente y monitorizar las tasas de rebote y quejas de spam.
- **Gestión de Rebotes (Bounces)**: El sistema debe identificar rebotes duros (direcciones de email inválidas) y blandos (buzón lleno). Las direcciones con rebotes duros deben ser eliminadas automáticamente de las listas activas para proteger la reputación del remitente.
- **Inconsistencia de Renderizado**: Un email puede verse perfecto en Gmail pero romperse en Outlook. El editor debe generar un HTML robusto y compatible, y se deben realizar pruebas en los principales clientes de correo.
- **Picos de Carga**: Programar un envío a 20,000 contactos a la vez puede sobrecargar el sistema. Los envíos deben ser gestionados a través de un sistema de colas robusto (como RabbitMQ o AWS SQS) que procese los envíos en lotes.
## KPIs y qué significan
En el contexto de un entrenador personal, los KPIs no son solo números, cuentan una historia sobre la relación con el cliente:
- **Tasa de Apertura**: Mide la efectividad del asunto y el nombre del remitente. Para un entrenador, indica: *'¿Mis clientes confían en mí y están interesados en lo que tengo que decir?'*. Una tasa de apertura alta sugiere una marca personal fuerte.
- **Tasa de Clics (CTR)**: Mide la relevancia y el atractivo del contenido del email. Responde a la pregunta: *'¿El consejo, la oferta o la historia que compartí fue lo suficientemente valiosa como para que mis clientes quisieran saber más?'*. Un CTR alto en un enlace a un nuevo plan es un indicador directo de interés de compra.
- **Tasa de Bajas (Unsubscribe Rate)**: Es un termómetro de la relevancia del contenido. Si sube, puede significar que se está enviando con demasiada frecuencia o que el contenido no aporta el valor esperado. Es una señal de alarma para reevaluar la estrategia de comunicación.
- **Tasa de Rebote (Bounce Rate)**: Indica la calidad de la lista de contactos. Una tasa alta sugiere que la lista está desactualizada. Para un entrenador, es un recordatorio de la importancia de mantener los datos de sus clientes al día.
- **Conversiones**: Es el KPI de negocio definitivo. Mide cuántos clientes realizaron una acción de valor (comprar un plan, registrarse en un reto, agendar una sesión) después de hacer clic en el email. Conecta directamente el esfuerzo de marketing con los ingresos del negocio.
## Diagramas de Flujo (Mermaid)
mermaid
graph TD
A[Inicio: Dashboard de Campañas] --> B{Crear Nueva Campaña};
B --> C[Elegir Plantilla o Empezar de Cero];
C --> D[Paso 1: Configuración (Asunto, Remitente)];
D --> E[Paso 2: Diseño del Email (Editor Visual)];
E --> F[Paso 3: Selección de Audiencia (Listas/Segmentos)];
F --> G{¿Enviar Ahora o Programar?};
G --> H[Enviar Inmediatamente];
G --> I[Seleccionar Fecha y Hora];
H --> J[Procesar en Cola de Envío];
I --> J;
J --> K[Envío Completado];
K --> L[Recopilar Analíticas (Aperturas, Clics)];
L --> M[Mostrar Reporte en el Dashboard];
